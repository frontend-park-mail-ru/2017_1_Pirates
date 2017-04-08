import {IControllable} from './IControllable';
import {INewable} from '../common/INewable';
import {MotionScene} from '../scenes/scene';
import {EventType} from '../common/EventType';


declare const BABYLON;
declare const JSWorks;


export class Entity extends (<INewable> BABYLON.Mesh) implements IControllable {

    private readonly modelName: 'spaceship';
    public shipHolderX: any;
    public shipHolderZ: any;
    public ship: any;
    public camera: any;
    public light: any;
    public joystick: any;
    public target: any;
    public explosion: any;

    public speed: number = 0.3;
    public bulletSpeed: number = 0.1;

    private angleX: number = 0;
    private angleY: number = 0;
    protected direction: any;
    protected exploding: number = -1;
    protected health: number = 10;


    constructor(name: string, scene: MotionScene, first: boolean = true) {
        super(name, scene);

        this.bulletSpeed = this.speed * 10;

		JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
			(event, emitter) => { this.onRender(event, emitter); });

        if (!first) {
			this.onMeshesLoaded(event, undefined);
        	return;
		}

        scene.meshesLoader.queue(this.modelName, '/game/assets/models/', 'spaceship.obj');

        JSWorks.EventManager.subscribe(this, scene, EventType.MESHES_LOAD,
            (event, emitter) => { this.onMeshesLoaded(event, emitter); });
    }


    public onMeshesLoaded(event, emitter) {
        this.shipHolderZ = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'shipHolder'),
            0.1,
            (<any> this).getScene()
        );
        this.shipHolderZ.parent = this;
        this.shipHolderZ.isVisible = false;

        this.shipHolderX = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'shipHolder'),
            0.1,
            (<any> this).getScene()
        );
        this.shipHolderX.parent = this.shipHolderZ;
        this.shipHolderX.isVisible = false;

        this.ship = (<any> this).getScene().meshesLoader.retrieve(this.modelName);
        this.ship = this.ship.clone(MotionScene.descendantName((<any> this).name, 'ship'));
        this.ship.parent = this.shipHolderX;
        this.ship.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.ship.rotation = new BABYLON.Vector3(3 * Math.PI / 2, 0, Math.PI);
        this.ship.setEnabled(true);

        this.ship.material = new BABYLON.StandardMaterial('ship', (<any> this).getScene());
        this.ship.material.emissiveColor = new BABYLON.Color3(107 / 255, 118 / 255, 186 / 255);


        this.camera = new BABYLON.TargetCamera(
            MotionScene.descendantName((<any> this).name, 'ship'),
            new BABYLON.Vector3(0, 0, 0),
            (<any> this).getScene()
        );
        this.camera.parent = this;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.position = new BABYLON.Vector3(0, 1, -5);
        this.camera.noRotationConstraint = true;

        this.joystick = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'ship'),
            0.1,
            (<any> this).getScene()
        );
        this.joystick.parent = this;
        this.joystick.position = new BABYLON.Vector3(0, 0, 5);
        this.joystick.isVisible = false;

        this.target = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'ship'),
            0.2,
            (<any> this).getScene()
        );
		this.target.material = new BABYLON.StandardMaterial('target', (<any> this).getScene());
		this.target.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
		this.target.material.emissiveIntensity = 10;
		this.target.material.alpha = 0.1;

        this.target.parent = this.shipHolderX;
        this.target.position = new BABYLON.Vector3(0, 0, 5);
		this.target.isVisible = true;

        this.light = new BABYLON.HemisphericLight(
            MotionScene.descendantName((<any> this).name, 'light'),
            new BABYLON.Vector3(0, 5, 1),
            (<any> this).getScene()
        );
        this.light.parent = this;
        // this.light.diffuse = new BABYLON.Color3(135 / 255, 69 / 255, 203 / 255);
		this.light.diffuse = new BABYLON.Color3(69 / 255, 110 / 255, 203 / 255);
        this.light.intensity = 0.3;

        this.explosion = new BABYLON.Mesh.CreateSphere(
        	'explosion',
			100,
			30,
			(<any> this).getScene(),
		);
        this.explosion.material = new BABYLON.StandardMaterial('expl', (<any> this).getScene());
		this.explosion.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

        this.explosion.scaling = new BABYLON.Vector3(1, 1, 1);
        this.explosion.parent = this.ship;
        this.explosion.isVisible = false;
    }


    public slowMo(prev: number, value: number, power: number = 50) {
        return (power * prev + value) / (power + 1);
    }


    protected static getTranslationMatrix(node, mul?, scaling?, position?, rotation?) {
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


    protected calculateMovement(modifier: number = 1) {
        const xMatrix = Entity.getTranslationMatrix(this.shipHolderX);
        const zMatrix = Entity.getTranslationMatrix(this.shipHolderZ);

		const tMatrix = BABYLON.Matrix.Compose(
			new BABYLON.Vector3(1, 1, 1),
			BABYLON.Quaternion.RotationYawPitchRoll(
				0,
				(<any> this).rotation.x,
				0,
			),
			BABYLON.Vector3.Zero(),
		);

        this.direction = new BABYLON.Vector3(0, 0, 1);
        // direction.addInPlace(new BABYLON.Vector3(0, this.joystick.position.y / 4 * 0.5, 0));

		this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, tMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, xMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, zMatrix);
        this.direction = this.direction.normalize().scale(modifier * this.speed);

        (<any> this).position.x += this.direction.x;// * this.speed;
        (<any> this).position.y += this.direction.y;// * this.speed;
        (<any> this).position.z += this.direction.z;// * this.speed;
    }


    public static acos(angle: number) {
        angle = (angle < -1) ? -1 : angle;
        angle = (angle > 1) ? 1 : angle;

        return Math.acos(angle);
    }


    public onRender(event, emitter) {
		// this.ship.isVisible = JSWorks._in_game_ === true;

		this.angleY = Entity.acos(-(this.joystick.position.y / this.joystick.position.z));
        this.angleX = Entity.acos( (this.joystick.position.x / this.joystick.position.z) * 1.3);

        /* this.shipHolderX.rotation.x = Entity.slowMo(
            this.shipHolderX.rotation.x,  Math.PI / 2 - this.angleY);
        this.shipHolderZ.rotation.z = Entity.slowMo(
            this.shipHolderZ.rotation.z, -Math.PI / 2 + this.angleX);

        let rot = this.shipHolderX.rotation.x;
        rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));

        (<any> this).rotation.x = Entity.slowMo((<any> this).rotation.x, rot);*/

		this.shipHolderX.rotation.x = this.slowMo(
			this.shipHolderX.rotation.x,  Math.PI / 2 - this.angleY);
		this.shipHolderX.rotation.y = this.slowMo(
			this.shipHolderX.rotation.y,  Math.PI / 2 - this.angleX);
		this.shipHolderX.rotation.z = this.slowMo(
			this.shipHolderX.rotation.z, (-Math.PI / 2 + this.angleX) * 2, 25);

		let rot = this.shipHolderX.rotation.x;
		rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));

		(<any> this).rotation.x = this.slowMo((<any> this).rotation.x, rot);

        this.calculateMovement(1);

        if (this.exploding >= 0) {
        	this.exploding++;

        	this.explosion.scaling.scaleInPlace(1 + this.exploding * 0.003);
        	this.explosion.material.alpha = (100 - this.exploding) * 0.008;

        	if (this.exploding > 100) {
        		this.exploding = 100;
			}
		}
    }


    public emitEvent(event) {};


    protected limitTarget(vector, distX, distY) {
        if (vector.x < -distX) vector.x = -distX;
        if (vector.y < -distY) vector.y = -distY;
        if (vector.x >  distX) vector.x =  distX;
        if (vector.y >  distY) vector.y =  distY;
    }


    public joystickMoved(x: number, y: number) {
    	if (this.exploding >= 0) {
    		return;
		}

        this.joystick.position.x +=  x * 0.005;
        this.joystick.position.y += -y * 0.012;

        this.limitTarget(this.joystick.position, 4, 4);
    }


    public joystickPressed() {
		if (this.exploding >= 0) {
			return;
		}

        (<any> this).getScene().bulletManager.fire(
            this.ship.getAbsolutePosition(),
            this.direction,
            this.bulletSpeed,
        );
    }

    public getCurrentPosition() {
        return this.ship.getAbsolutePosition();
    }


    public remove() {
		(<any> this).getScene().removeMesh(this.shipHolderZ);
		(<any> this).getScene().removeMesh(this.shipHolderX);
		(<any> this).getScene().removeMesh(this.ship);
		(<any> this).getScene().removeMesh(this.camera);
		(<any> this).getScene().removeMesh(this.target);
		(<any> this).getScene().removeMesh(this.joystick);
		(<any> this).getScene().removeMesh(this.light);
		(<any> this).getScene().removeMesh(this);

		this.shipHolderZ.dispose(true);
		this.shipHolderX.dispose(true);
		this.ship.dispose(true);
		this.camera.dispose(true);
		this.target.dispose(true);
		this.joystick.dispose(true);
		this.light.dispose(true);
		(<any> this).dispose(true);
	}


	public explode() {
    	this.health--;

    	if (this.health > 0) {
    		return;
		}

		if (this.exploding === -1) {
			this.exploding = 0;

			this.ship.isVisible = false;
			this.explosion.isVisible = true;
			return;
		}
	}


}
