import {MotionScene} from './scenes/scene';
import {EventType} from "./common/EventType";


declare const BABYLON: any;
declare const JSWorks: any;


interface IResolution { width?: number, height?: number, }
interface ICoord { x: number, y: number }


class Game {

    private canvas: HTMLCanvasElement;
    private engine: any;
    private scene: MotionScene;
    private events: { [type: string]: (event) => void } = {};
    private genericWindowEventReceiver: (event) => void;
    private lastMousePos: ICoord;

    public resizable: boolean = false;
    public pointerLocked: boolean = false;


    constructor(canvas: HTMLCanvasElement, resizable: boolean = false, res?: IResolution) {
        this.resizable = resizable;
        this.canvas = canvas;
        this.initCanvas(res);
        this.scene = new MotionScene(this.engine);

        this.events = {
            resize: this.onResize,
            mousemove: this.onPointerMove,
            keydown: this.onKeyDown,
            click: this.onClick,

            pointerlockchange: this.onPointerLockChange,
            mozpointerlockchange: this.onPointerLockChange,
            webkitpointerlockchange: this.onPointerLockChange,
        }
    }


    public run() {
        this.scene.init();
        this.initEventListeners();
        this.initCanvasPointerLock();
    }


    public stop() {
        this.freeEventListeners();
    }


    public onResize(event) {
        if (this.resizable) {
            this.engine.resize();
        }
    }


    public onClick(event) {
		// this.pointerLocked = true;
		// this.canvas.requestPointerLock();

		if (!JSWorks._game.scene.inMenu) {
			(<any> this.scene).emitEvent({type: EventType.JOYSTICK_PRESS});
		}
    }


    public onPointerMove(event) {
        if (!this.lastMousePos) {
            this.lastMousePos = { x: event.screenX, y: event.screenY };
            return;
        }

        const curMousePos = { x: event.screenX, y: event.screenY, };
        const diffX = event.movementX || this.lastMousePos.x - curMousePos.x;
        const diffY = event.movementY || this.lastMousePos.y - curMousePos.y;

        if (this.pointerLocked) {
            (<any> this.scene).emitEvent({ type: EventType.JOYSTICK_MOVE, data: { x: diffX, y: diffY } });
        }

        this.lastMousePos = curMousePos;
    }


    public togglePointerLock() {
		this.pointerLocked = !this.pointerLocked;

		if (!this.pointerLocked) {
			document.exitPointerLock();
			return;
		}

		this.canvas.requestPointerLock();
	}


    public onKeyDown(event) {
        if (event.keyCode === "L".charCodeAt(0)) {
        	if (!JSWorks._game.scene.inMenu) {
				this.togglePointerLock();
				this.scene.playMusic();
			}
        }
    }


    public onPointerLockChange(event) {
        const lock = document.pointerLockElement ||
            (<any> document).mozPointerLockElement ||
            (<any> document).webkitPointerLockElement;
        if (lock !== this.canvas) {
            this.pointerLocked = false;
            return;
        }

        this.pointerLocked = true;
    }

    private initCanvas(res?: IResolution) {
        let canvasSize = { height: '100%', width: '100%' };

        if (res) {
            canvasSize.height = `${res.height.toString()}px` || canvasSize.height;
            canvasSize.width = `${res.width.toString()}px` || canvasSize.width;
        }

        this.canvas.style.height = canvasSize.height;
        this.canvas.style.width = canvasSize.width;

        this.engine = new BABYLON.Engine(this.canvas, true);

        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    }


    private initEventListeners() {
        this.genericWindowEventReceiver = (event) => {
            this.events[event.type].bind(this)(event);
        };

        Object.keys(this.events).forEach(type => {
            window.addEventListener(type, this.genericWindowEventReceiver, false);
        });
    }


    private freeEventListeners() {
        Object.keys(this.events).forEach(type => {
            window.removeEventListener(type, this.genericWindowEventReceiver);
        });
    }


    private initCanvasPointerLock() {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
            (<any> this.canvas).mozRequestPointerLock ||
            (<any> this.canvas).webkitRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock ||
            (<any> document).mozRequestPointerLock ||
            (<any> document).webkitRequestPointerLock;
    }

}

JSWorks.__router_disabled__ = true;



window.addEventListener('load', () => {
	const game = new Game(
		<HTMLCanvasElement> document.getElementById('render-canvas'),
		false,
		//{ width: 320, height: 240 }
	);

	JSWorks._game = game;

	window.setTimeout(() => {
		/* const game = new Game(
			<HTMLCanvasElement> document.getElementById('render-canvas'),
			false,
			//{ width: 320, height: 240 }
		);

		JSWorks._game = game; */
		game.run();
	}, 1000);
});

