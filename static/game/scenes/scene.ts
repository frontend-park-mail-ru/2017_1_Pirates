import {INewable} from '../common/INewable';
import {Entity} from '../entity/entity';
import {IControllable} from '../entity/IControllable';
import {EventType} from '../common/EventType';
import {BulletManager} from '../entity/BulletManager';
import {Loader} from "../common/Loader";
import {Skydome} from "../sky/skydome";
import {Map} from "../map/map";
import {SimpleEnemy} from "../entity/SimpleEnemy";


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
    public entities: Entity[] = [];

    private last_position: number;
    private lastEnemy: number = 0;
    private ticks: number = -1;

    public playerAbs;
    public time = 0;
    public inMenu: boolean = true;
    public music: any;


    constructor(engine) {
        super(engine);

        engine.enableOfflineSupport = false;
        this.bulletManager = new BulletManager(this);
        // this.map = new Map('motion-map', this);

        this.last_position = 0;
		// this.music = new BABYLON.Sound('field', "./game/assets/audio/field.wav", this);

        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_MOVE, (event) => {
			this.currentInput.joystickMoved(event.data.x, event.data.y);
		});

        JSWorks.EventManager.subscribe(this, this, EventType.JOYSTICK_PRESS, (event) => {
			this.currentInput.joystickPressed();
		});

        JSWorks.EventManager.subscribe(this, this, EventType.RENDER, (event) => {
			// this.onMapEnds();
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

        JSWorks.EventManager.subscribe(this, this.meshesLoader, EventType.LOAD_SUCCESS, () => {
			this.onLoaderSuccess();
		});
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

        JSWorks.EventManager.subscribe(this, this.shadersLoader, EventType.LOAD_SUCCESS, () => {
			this.onLoaderSuccess();
		});
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

        this.postInit();

        this.skydome = new Skydome('skydome', this);
        (<any> this.skydome).position.z = 100;

        this.loader.load();
        this.meshesLoader.load();
        this.shadersLoader.load();
    }


    public postInit() {
    	this.entities = [];

		this.player = new Entity('player', this);
		this.currentInput = this.player;
		this.entities.push(this.player);
	}


    public static getRandomCoord(scater: number = 30): number {
		return (Math.random() * 2 - 1) * scater;
	}


    public initRandomEnemy(): void {
    	if (this.entities.length > 50) {
    		return;
		}

    	const enemy: SimpleEnemy = new SimpleEnemy(`enemy_${this.lastEnemy}`, this);
		(<any> enemy).__lived = 0;

    	const playerPos = (<any> this.currentInput).getAbsolutePosition();

		(<any> enemy).position = new BABYLON.Vector3(
			playerPos.x + MotionScene.getRandomCoord(),
			playerPos.y + MotionScene.getRandomCoord(),
			playerPos.z + MotionScene.getRandomCoord() + 200,
		);

		this.entities.push(enemy);
	}


	public render(): void {
		(<any> this.currentInput).health = 100;

    	if (Math.random() < 0.02) {
			this.initRandomEnemy();
		}

		this.playerAbs = (<any> this.currentInput).getAbsolutePosition();

		this.entities.forEach((entity: any, index: number) => {
			if (entity.exploding >= 100) {
				if (!entity.__lived) {
					return;
				}

				entity.remove();
				this.entities.splice(index, 1);

				return;
			}

			if (entity.__lived === undefined) {
				return;
			}

			entity.__lived++;

			if (entity.__lived > 1000) {
				entity.remove();
				this.entities.splice(index, 1);

				return;
			}
		});

    	if (this.ticks > 50) {
    		this.ticks = -1;
		}

    	if (this.ticks < 0) {
    		// document.title = `Meshes: ${(<any> this).meshes.length}`;
			document.title = `Bullets: ${this.bulletManager.bullets.length}`;
		}

		this.ticks++;
		super.render();
	}


	public newGame() {
		(<any> this.currentInput).exploding = -1;
		(<any> this.currentInput).health = 50;
		(<any> this.currentInput).ship.isVisible = true;
		(<any> this.currentInput).target.isVisible = true;
		(<any> this.currentInput).explosion.isVisible = false;
		(<any> this.currentInput).explosion.scaling = new BABYLON.Vector3(1, 1, 1);
	}


	public loose() {
		(<any> this.currentInput).health = 0;
		(<any> this.currentInput).explode();
	}


    public run() {
        (<any> this).setActiveCameraByName(this.player.camera.name);
        this.player.camera.attachControl((<any> this).getEngine().getRenderingCanvas(), true);
        this.player.camera.maxZ = 100000;

        (<any> this).meshes.forEach((mesh) => {
            if (mesh.__skybox__) {
                mesh.renderingGroupId = 0;
                return;
            }

            mesh.renderingGroupId = 1;
        });

        (<any> this).getEngine().runRenderLoop(() => {
			this.time = (new Date()).getMilliseconds();

			(<any> this).emitEvent({type: EventType.RENDER});

			if (this.inMenu) {
				(<any> this.currentInput).health = 100;
			}

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


    public playMusic() {
		// this.music.play();
	}


    public getPlayer(): Entity {
        return this.player;
    }
}
