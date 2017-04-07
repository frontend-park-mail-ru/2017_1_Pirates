import {INewable} from '../common/INewable';
import {Entity} from '../entity/entity';
import {IControllable} from '../entity/IControllable';
import {EventType} from '../common/EventType';
import {BulletManager} from '../entity/BulletManager';
import {Loader} from "../common/Loader";
import {Skydome} from "../sky/skydome";
import {Map} from "../map/map";


declare const BABYLON;
declare const JSWorks;


export class MotionScene extends (<INewable> BABYLON.Scene) {

    private player: Entity;
    private skydome: Skydome;

    private map: Map;

    public meshesLoader: Loader;
    public shadersLoader: Loader;
    private loadersCount: number = 0;
    private loadersFired: number = 0;

    private loader;
    public currentInput: IControllable;
    public bulletManager: BulletManager;


    private last_position: number;

    constructor(engine) {
        super(engine);
        engine.enableOfflineSupport = false;
        this.bulletManager = new BulletManager(this);
        this.map = new Map('motion-map', this);
        // this.last_position = - this.map.chunkSize.height / 2;
        this.last_position = 0;
        console.log("last", this.last_position);

        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_MOVE,
            (event, emitter) => {
                this.currentInput.joystickMoved(event.data.x, event.data.y);
            });
        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_PRESS,
            (event, emitter) => {
                this.currentInput.joystickPressed();
            });

        JSWorks.EventManager.subscribe(this, this, EventType.RENDER,
            (event, emiter) => {
                this.onMapEnds();
            });
    }


    public initMeshesLoader() {
        this.meshesLoader = new Loader(this.loader);
        this.loadersCount++;

        this.meshesLoader.taskAdder = (self, name, root, file) => {
            return self.loader.addMeshTask(name, '', root, file);
        };

        this.meshesLoader.resultGetter = (self, task) => {
            task.loadedMeshes[0].setEnabled(false);
            return task.loadedMeshes[0];
        };

        JSWorks.EventManager.subscribe(this, this.meshesLoader, EventType.LOAD_SUCCESS,
            () => {
                this.onLoaderSuccess();
            })
    }


    public initShadersLoader() {
        this.shadersLoader = new Loader(this.loader);
        this.loadersCount++;

        this.shadersLoader.taskAdder = (self, name, root, file) => {
            return self.loader.addTextFileTask(name, `${root}/${file}`);
        };

        this.shadersLoader.resultGetter = (self, task) => {
            BABYLON.Effect.ShadersStore[task.name] = task.text;
            return task.text;
        };

        JSWorks.EventManager.subscribe(this, this.shadersLoader, EventType.LOAD_SUCCESS,
            () => {
                this.onLoaderSuccess();
            })
    }


    public onLoaderSuccess() {
        this.loadersFired++;

        if (this.loadersCount === this.loadersFired) {
            [EventType.MESHES_LOAD, EventType.SHADERS_LOAD].forEach((type) => {
                (<any> this).emitEvent({type: type});
            });

            this.run();
        }
    }


    public init() {
        this.loader = new BABYLON.AssetsManager(this);

        this.initMeshesLoader();
        this.initShadersLoader();

        this.player = new Entity('player', this);
        this.currentInput = this.player;

        this.skydome = new Skydome('skydome', this);
        (<any> this.skydome).position.z = 100;

        this.map.loadChunks();
        // this.map.initRandomChunk();
        this.map.initStartChunks();
        // this.last_position = - this.map.chunkSize.height / 2;
        // const ground = BABYLON.Mesh.CreateGround('ground', 5000, 5000, 250, this);
        // ground.position.y = -10;
        // ground.material = new BABYLON.StandardMaterial('ground', this);
        // ground.material.wireframe = true;

        this.loader.load();
        this.meshesLoader.load();
        this.shadersLoader.load();
    }


    public run() {
        (<any> this).setActiveCameraByName(this.player.camera.name);
        this.player.camera.attachControl((<any> this).getEngine().getRenderingCanvas(), true);

        (<any> this).meshes.forEach((mesh) => {
            if (mesh.__skybox__) {
                mesh.renderingGroupId = 0;
                return;
            }

            mesh.renderingGroupId = 1;
        });

        (<any> this).getEngine().runRenderLoop(() => {
            (<any> this).emitEvent({type: EventType.RENDER});
            (<any> this).render();
        });
    }


    public static descendantName(parentName: string, name: string): string {
        return `${parentName}__${name}`;
    }

    /**
     * метод проверки долетел ли игрок на край текущего блока, если да эмиттим событие MAP_ENDS
     */
    public onMapEnds(): void {
        const shipPosition = this.player.getCurrentPosition();
        const border = this.map.activeChunk.getBorder();
        if ((shipPosition.z >= border.rightTop.z) || (shipPosition.x <= border.leftDown.x) ||
            (shipPosition.x >= border.rightTop.x)) {

            const potentialArea = {
                leftDown: {
                    x: shipPosition.x - this.map.potentialArea.side / 2,
                    z: shipPosition.z - 10,
                },
                rightTop: {
                    x: shipPosition.x + this.map.potentialArea.side / 2,
                    z: shipPosition.z + this.map.potentialArea.front,
                },
            };
            (<any> this).emitEvent({type: EventType.MAP_ENDS, data: {visibleArea: potentialArea, shipPosition: shipPosition}});
        }
    }

    public getPlayer(): Entity {
        return this.player;
    }
}
