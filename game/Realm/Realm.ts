import BABYLON from "../../static/babylon";
import {RealmScene} from "./RealmScene";
import {Camera} from "../Camera/Camera";
import {ObjectFactory} from "../ObjectFactory/ObjectFactory";
import {RealmSky} from "./RealmSky";
import {RealmState} from "./RealmState";
import {TestState} from "../States/TestState";
import {LoadingScreen} from "../Loader/LoadingScreen";
import {Loader} from "../Loader/Loader";
import {StarShip} from "../Models/StarShip";
import {OfflineGameState} from "../States/OfflineGameState";
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {MenuState} from "../States/MenuState";
import {GUIFlashingAnimation} from "../Utils/GUIFlashingAnimation";


declare const JSWorks: JSWorksLib;


export class RealmClass {

    public meshesLoader: Loader;
    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: RealmScene;
    public camera: Camera;
    public objects: ObjectFactory;
    public sky: RealmSky;
    public fx: BABYLON.HDRRenderingPipeline;

    public fps: number = 0;
    public timeDelta: number = 0;
    public animModifier: number = 0;

    private states: Map<string, RealmState> = new Map<string, RealmState>();
    public state: RealmState;
    public pointerLocked: boolean = false;

    private yMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationY(0.5 * Math.PI);
    private zMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationZ(0.5 * Math.PI);

    private HUD: HTMLElement = <HTMLElement> document.querySelector('#game-hud');
    private hudSpeedometer: HTMLCanvasElement = <HTMLCanvasElement> document.querySelector('#hud-speedometer');
    private speedCtx: CanvasRenderingContext2D = this.hudSpeedometer.getContext('2d');
    private timer: HTMLElement = <HTMLElement> this.HUD.querySelector('#hud-timer-value');
    private score: HTMLElement = <HTMLElement> this.HUD.querySelector('#hud-score-value');
    private currentPlace: HTMLElement = <HTMLElement> this.HUD.querySelector('#hud-current-place');
    private totalPlaces: HTMLElement = <HTMLElement> this.HUD.querySelector('#hud-total-places');
    private combo: HTMLElement = <HTMLElement> this.HUD.querySelector('#hud-combo');
    private comboValue: HTMLElement = <HTMLElement> this.combo.querySelector('#hud-combo-value');
    private comboText: HTMLElement = <HTMLElement> this.combo.querySelector('#hud-combo-text');

    private pauseMenu : HTMLElement = <HTMLElement> document.querySelector('#pause-menu');
    private continueBtn: HTMLElement = <HTMLElement> this.pauseMenu.querySelector('#pause-menu__continue');
    private exitBtn: HTMLElement = <HTMLElement> this.pauseMenu.querySelector('#pause-menu__exit');

    private gameOver: HTMLElement = <HTMLElement> document.querySelector('#gameover');
    private scoreResult: HTMLElement = <HTMLElement> this.gameOver.querySelector('#gameover__score');

    private running: boolean = true;
    public menuPlaying: boolean = true;
    public dyingFlashing: boolean = false;
    public isDying: boolean = false;
    public loaded: boolean = false;


    public static now(): number {
        return window.performance.now();
    }


    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.querySelector(`#${canvasId}`);
        // this.initCanvas({width: 10, height: 10});
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.loadingScreen = new LoadingScreen('');
        this.scene = new RealmScene(this.engine);
        this.camera = new Camera('camera', this.scene);
        this.objects = new ObjectFactory();
        this.meshesLoader = new Loader();

        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        /*BABYLON.SceneOptimizer.OptimizeAsync(this.scene,
            BABYLON.SceneOptimizerOptions.HighDegradationAllowed()
        );*/
        this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        /*this.canvas.addEventListener('click', () => {
            if (!this.pointerLocked) {
                this.grabPointerLock();
            }
        });*/
        window.setInterval(() => {
            if (!this.state) {
                return;
            }

            if (!this.scene.menuMusic['_shouldNotPlay'] && !this.scene.menuMusic.isPlaying) {
                this.scene.menuMusic.play();
            }
        }, 1000);

        if ('onpointerlockchange' in document) {
            document.addEventListener('pointerlockchange', () => { this.pointerLockChanged(); });
        } else if ('onmozpointerlockchange' in document) {
            document.addEventListener('mozpointerlockchange', () => { this.pointerLockChanged(); });
        } else if ('onwebkitpointerlockchange' in document) {
            document.addEventListener('webkitpointerlockchange', () => { this.pointerLockChanged(); });
        }

        (<HTMLElement> document.querySelector('.base-container')).style.visibility = 'hidden';

        document.addEventListener('keyup', (e) => {
            if (this.state.name === 'offlineGame' && e.keyCode === 32) {
                this.togglePauseMenu(true);
            }
        });

        this.continueBtn.addEventListener('click', () => {
            this.togglePauseMenu(false);
        });

        this.exitBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            this.dropPointerLock();
            document.location.href = '/';
        });


        document.querySelector('#gameover__exit').addEventListener('click', (event) => {
            event.stopPropagation();
            this.dropPointerLock();
            document.location.href = '/';
        });

        document.querySelector('#gameover__save-btn').addEventListener('click', (event) => {
            const creationData = {
                'score': Math.floor((<OfflineGameState> this.state).score),
                'kills': Math.floor((<OfflineGameState> this.state).kills),
                'max_combo': Math.floor((<OfflineGameState> this.state).longestCombo)
            };

            JSWorks.applicationContext.modelHolder
                .getModel('ScoreModel')
                .from(creationData)
                .create().then(rs => {
                    console.log("Info: score saved", rs);
                    event.stopPropagation();
                    this.dropPointerLock();
                    window.setTimeout(() => {
                        document.location.href = '/';
                    },20);
                });


        });



        this.meshesLoader.taskAdder = (self, name, root, file) => {
            return this.scene.loader.addMeshTask(name, '', root, file);
        };

        this.meshesLoader.resultGetter = (self, task) => {
            task.loadedMeshes[0].setEnabled(false);

            return task.loadedMeshes[0];
        };
    }


    public togglePauseMenu(value: boolean): void {
        if (value) {
            this.pauseMenu.style.display = 'flex';
            this.pauseMenu.style.backgroundColor = 'rgba(0,0,0,0.2)';
            this.running = false;
            this.dropPointerLock();
        } else {
            this.pauseMenu.style.display = 'none';
            this.running = true;
        }
    }


    public flashDyingSoon(): void {
        const lastDyingFlashing: boolean = this.dyingFlashing;
        this.dyingFlashing = true;
        this.isDying = true;

        if (!lastDyingFlashing) {
            this.toggleCountdown(true, 'Вернитесь на дорогу!');

            this.flashCountdown().then(() => {
                if (!this.dyingFlashing) {
                    this.toggleCountdown(false, '');
                    return;
                }

                this.flashCountdown().then(() => {
                    if (!this.dyingFlashing) {
                        this.toggleCountdown(false, '');
                        return;
                    }

                    this.flashCountdown().then(() => {
                        this.dieImmediately();
                    });
                });
            });
        }
    }


    public doNotDie(): void {
        this.dyingFlashing = false;

        if (this.isDying) {
            this.toggleCountdown(false, '');
        }
    }


    public dieImmediately(): void {
        this.toggleCountdown(false, '');
        this.dropPointerLock();
        (<OfflineGameState> this.state).getLeadingPlayer().canMove = false;
        (<OfflineGameState> this.state).getLeadingPlayer().setEnabled(false);
        (<OfflineGameState> this.state).explodeAt(
            (<OfflineGameState> this.state).getLeadingPlayer().position
        );

        document.querySelector('#gameover__score').innerHTML =
                String(Math.floor((<OfflineGameState> this.state).score));
        document.querySelector('#gameover__kills').innerHTML =
                String((<OfflineGameState> this.state).kills);
        document.querySelector('#gameover__combo').innerHTML =
                String((<OfflineGameState> this.state).longestCombo);

        window.setTimeout(() => {
            this.toggleGameOver(true);
        }, 1000);
    }


    public setPointerLock(): void {
        if (!this.pointerLocked) {
            this.grabPointerLock();
        }
    }


    public getLeadingPlayer(): StarShip {
        return (<OfflineGameState> this.state).getLeadingPlayer();
    }


    public setRenderGroupIDs(): void {
        this.scene.meshes.forEach((mesh: BABYLON.Mesh) => {
            if (mesh['__skybox__']) {
                mesh.renderingGroupId = 0;
                return;
            }

            if (!(mesh instanceof BABYLON.InstancedMesh)) {
                mesh.renderingGroupId = 1;
            }
        });
    }


    public init(): void {
        this.meshesLoader.queue('spaceship', '/static/models/', 'spaceship.obj');
        this.sky = new RealmSky('sky', this.scene);
        this.scene.load();
        this.toggleLoading(true);
        this.toggleHUD(false);

        this.meshesLoader.load().then(() => {
            this.loadStates();

            this.objects.load().then(() => {
                this.notifyLoaded();
                this.initFX();

                (<HTMLElement> document.querySelector('.base-container')).style.visibility = 'visible';
                this.loaded = true;
                let oldMillis: number = RealmClass.now();

                this.engine.runRenderLoop(() => {
                    const newMillis: number = RealmClass.now();

                    this.timeDelta = newMillis - oldMillis;
                    this.animModifier = 1 / (this.timeDelta / (1000 / 60));

                    this.fps = Math.floor(60 * this.animModifier);
                    this.animModifier = 1.2;

                    if (this.running) {
                        this.render();
                    }


                    oldMillis = newMillis;
                    // document.title = `, FPS: ${this.fps}`;
                });

                this.changeState('menu');
            });
        });
    }


    public drawSpeedometer(speed: number): void {
        this.speedCtx.clearRect(0, 0, this.hudSpeedometer.width, this.hudSpeedometer.height);

        const minStripeLen: number = 10;
        const maxStripeLen: number = 110;
        const stripeCount: number = 8;

        const stripeDelta = maxStripeLen - minStripeLen;
        speed *= stripeCount;

        for (let i = 0; i < stripeCount; i++) {
            const curStripeLen = minStripeLen + stripeDelta *
                (1 - Math.sin((i / stripeCount + 1) * Math.PI * 0.5));

            this.speedCtx.fillStyle = (i < speed) ? 'rgb(211, 42, 156)' : 'rgb(200, 200, 200)';
            this.speedCtx.strokeStyle = 'rgb(255, 255, 255)';
            this.speedCtx.lineWidth = 2;
            this.speedCtx.strokeRect(this.hudSpeedometer.width - curStripeLen - 11,
                (stripeCount - i) * 14 - 1, curStripeLen + 2, 5 + 2);
            this.speedCtx.fillRect(this.hudSpeedometer.width - curStripeLen - 10,
                (stripeCount - i) * 14, curStripeLen, 5);
            this.speedCtx.fillStyle = 'rgba(0, 0, 0, 0)';
        }
    }


    public toggleLoading(value: boolean, text: string = 'Загрузка... пожалуйста, подождите.'): void {
        const loader: SimpleVirtualDOMElement = JSWorks.applicationContext.currentPage['view'].DOMRoot
                .querySelector('.loader-container');
        this.toggleBlur(value);
        loader.toggleClass('hidden', !value);
        loader.querySelector('.loader-text').innerHTML = text;
    }


    public toggleBlur(value: boolean): void {
        const content: HTMLElement = <HTMLElement> document.querySelector('.game-content');
        content.classList.toggle('blurred', value);
    }


    public toggleGameOver(value: boolean): void {
        this.gameOver.style.display = (value) ? 'flex' : 'none';
    }


    public toggleHUD(value: boolean): void {
        this.HUD.classList.toggle('hidden', !value);
    }

    public flashHUD(): Promise<any> {
        return GUIFlashingAnimation.Visibility(this.HUD, 3, 1000);
    }

    public flashCountdown(): Promise<any> {
        return GUIFlashingAnimation.Visibility(this.HUD.querySelector('#hud-countdown'), 3, 700);
    }

    public toggleCountdown(value: boolean, text: string): void {
        const countdown = this.HUD.querySelector('#hud-countdown');
        countdown.classList.toggle('hidden', !value);
        countdown.innerHTML = text;
    }

    public toggleTimer(value: boolean, text: string): void {
        this.timer.classList.toggle('hidden', !value);
        this.timer.innerHTML = text;
    }

    public setScore(value: number): void {
        this.score.innerHTML = String(value);
    }

    public flashScore(): void {
        GUIFlashingAnimation.Visibility(this.score, 3, 500);
    }

    public setPlace(place: number, total: number): void {
        this.currentPlace.innerHTML = String(place);
        this.totalPlaces.innerHTML = String(place);
    }

    public toggleCombo(current: number): void {
        if (current === 0) {
            this.combo.classList.toggle('hidden', true);
            return;
        }

        this.combo.classList.toggle('hidden', false);
        let width: number = current * 10;

        if (width > 100) {
            width = 100;
        }

        this.comboValue.style.width = `${width}%`;
        this.comboText.innerHTML = `Комбо х${current}`;
    }

    public flashCombo(): Promise<any> {
        return GUIFlashingAnimation.Visibility(this.combo, 3, 500);
    }


    private initFX(): void {
        /*this.fx = new BABYLON.HDRRenderingPipeline(
            'standard',
            this.scene,
            1.0,
            null,
            [this.camera.camera],
        );*/

        //this.camera.camera.ad

        /*this.fx = new BABYLON.PostProcessRenderPipeline(this.engine, 'fx');
        this.fx._attachCameras([this.camera.camera]);

        const highlights: BABYLON.PostProcess = new BABYLON.PostProcess('LensHighlights', 'lensHighlights',
                ['gain', 'threshold', 'screen_width', 'screen_height'],      // uniforms
                [],     // samplers
                0.2,
                null, BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
                this.engine, false, /*this._dofPentagon ? "#define PENTAGON\n" : *//*'');

        highlights.onApply = (effect: BABYLON.Effect) => {
            effect.setFloat('gain', -0.7);
            effect.setFloat('threshold', 0.7);
            // effect.setTextureFromPostProcess("textureSampler", this._chromaticAberrationPostProcess);
            effect.setFloat('screen_width', (<any> this.engine.getRenderingCanvas()).width);
            effect.setFloat('screen_height', (<any> this.engine.getRenderingCanvas()).height);
        };

        this.fx.addEffect(new BABYLON.PostProcessRenderEffect(
            this.engine,
            'HighlightsEnhancingEffect',
            () => { return highlights; },
            true
        ));*/

        /*this.fx = new BABYLON.LensRenderingPipeline(
            'lens',
            { dof_focus_distance: undefined },
            this.scene,
            1.0,
            [this.camera.camera],
        );*/

        //this.fx.brightThreshold = 0.7;
        //this.fx.exposure = 1.2;
        //(<any> this.fx).HDREnabled = true;
    }


    public changeState(name: string): void {
        if (this.state) {
            this.state.onLeave();
        }

        this.state = this.getState(name);
        this.camera.lookAtDirection(this.state.alpha);
        this.state.onEnter();
    }


    public addState(state: RealmState): void {
        this.states.set(state.name, state);
    }

    public getState(name: string): RealmState {
        return this.states.get(name);
    }


    public render(): void {
        this.objects.notifyRendered();
        this.state.onRender();
        this.camera.onRender();
        this.scene.render();
    }


    private loadStates(): void {
        // this.addState(new TestState('first', this.scene));
        // this.addState(new TestState('second', this.scene));
        // this.addState(new TestState('third', this.scene));
        this.addState(new OfflineGameState('offlineGame', this.scene));
        this.addState(new MenuState('menu', this.scene));
    }


    private notifyLoaded(): void {
        this.objects.notifyLoaded();

        this.states.forEach((value: RealmState) => {
            value.notifyLoaded();
        });
    }


    public calculateLag(oldValue: number, newValue: number, lag: number): number {
        lag /= this.animModifier;
        return (oldValue * lag + newValue) / (lag + 1);
    }

    public calculateVectorLag(oldVector: BABYLON.Vector3, newVector: BABYLON.Vector3, lag: number): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            this.calculateLag(oldVector.x, newVector.x, lag),
            this.calculateLag(oldVector.y, newVector.y, lag),
            this.calculateLag(oldVector.z, newVector.z, lag),
        )
    }

    public calculateAnim(initValue: number, oldValue: number, newValue: number, frames: number): number {
        const delta: number = (newValue - initValue) / frames;
        const curDelta: number = newValue - oldValue;

        if (Math.abs(curDelta) < Math.abs(delta)) {
            return newValue;
        }

        return oldValue + delta * this.animModifier;
    }

    public calculateVectorAnim(initVector: BABYLON.Vector3, oldVector: BABYLON.Vector3, newVector: BABYLON.Vector3,
            frames: number): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            this.calculateAnim(initVector.x, oldVector.x, newVector.x, frames),
            this.calculateAnim(initVector.y, oldVector.y, newVector.y, frames),
            this.calculateAnim(initVector.z, oldVector.z, newVector.z, frames),
        );
    }

    public randItem(array: any[]): any {
        return array[Math.floor(Math.random() * array.length)];
    }

    public grabPointerLock(): void {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                (<any> this.canvas).mozRequestPointerLock ||
                (<any> this.canvas).webkitRequestPointerLock;

        this.canvas.requestPointerLock();
    }

    public dropPointerLock(): void {
       document.exitPointerLock = document.exitPointerLock ||
           (<any> document).mozExitPointerLock ||
           (<any> document).webkitExitPointerLock;

        document.exitPointerLock();
    }

    public pointerLockChanged(): void {
        this.pointerLocked = !this.pointerLocked;
    }



    public rotationFromDirection(direction: BABYLON.Vector3): BABYLON.Vector3 {
        // Expecting a normalized direction vector

        const x: BABYLON.Vector3 = direction;
        const y: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates(x, this.yMatrix);
        const z: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates(x, this.zMatrix);

        return BABYLON.Vector3.RotationFromAxis(z, y, x);
    }

    public getTranslationMatrix(node, mul?, scaling?, position?, rotation?) {
        return BABYLON.Matrix.Compose(
            scaling || (node || {}).scaling || new BABYLON.Vector3(1, 1, 1),
            BABYLON.Quaternion.RotationYawPitchRoll(
                rotation || ((node || {}).rotation || {}).y || 0,
                rotation || ((node || {}).rotation || {}).x || 0,
                rotation || ((node || {}).rotation || {}).z || 0,
            ),
            (position || (node || {}).position || BABYLON.Vector3.Zero()).scale(mul || 1),
        );
    }

    public sign(x: number): number {
        return x < 0 ? -1 : 1;
    }

    public mixColors(color1: BABYLON.Color3, color2: BABYLON.Color3, ratio: number): BABYLON.Color3 {
        const revRatio: number = 1 - ratio;

        return new BABYLON.Color3(
            color1.r * ratio + color2.r * revRatio,
            color1.g * ratio + color2.g * revRatio,
            color1.b * ratio + color2.b * revRatio,
        )
    }


    public sleep(millis: number): Promise<any> {
        return new Promise<any>((resolve) => {
            window.setTimeout(() => { resolve() }, millis);
        });
    }

}

