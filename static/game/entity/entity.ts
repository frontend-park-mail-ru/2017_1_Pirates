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

    public speed: number = 1.0;

    private angleX: number = 0;
    private angleY: number = 0;
    private direction: any;


    constructor(name: string, scene: MotionScene) {
        super(name, scene);

        scene.meshesLoader.queue(this.modelName, '/game/assets/models/', 'spaceship.obj');

        JSWorks.EventManager.subscribe(this, scene, EventType.MESHES_LOAD,
            (event, emitter) => { this.onMeshesLoaded(event, emitter); });
        JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
            (event, emitter) => { this.onRender(event, emitter); });
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
            0.1,
            (<any> this).getScene()
        );
        this.target.parent = this.shipHolderX;
        this.target.position = new BABYLON.Vector3(0, 0, 5);
		this.target.isVisible = false;

        this.light = new BABYLON.HemisphericLight(
            MotionScene.descendantName((<any> this).name, 'light'),
            new BABYLON.Vector3(0, 5, 1),
            (<any> this).getScene()
        );
        this.light.parent = this;
        // this.light.diffuse = new BABYLON.Color3(135 / 255, 69 / 255, 203 / 255);
		this.light.diffuse = new BABYLON.Color3(69 / 255, 110 / 255, 203 / 255);
        this.light.intensity = 0.8;
    }


    public static slowMo(prev: number, value: number, power: number = 50) {
        return (power * prev + value) / (power + 1);
    }


    private static getTranslationMatrix(node, mul?, scaling?, position?, rotation?) {
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


    private calculateMovement(modifier: number = 1) {
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

        this.direction = new BABYLON.Vector3(0, 0, modifier * this.speed);
        // direction.addInPlace(new BABYLON.Vector3(0, this.joystick.position.y / 4 * 0.5, 0));

		this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, tMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, xMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, zMatrix);

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
		this.ship.isVisible = JSWorks._in_game_ === true;

		this.angleY = Entity.acos(-(this.joystick.position.y / this.joystick.position.z));
        this.angleX = Entity.acos( (this.joystick.position.x / this.joystick.position.z) * 1.3);

        this.shipHolderX.rotation.x = Entity.slowMo(
            this.shipHolderX.rotation.x,  Math.PI / 2 - this.angleY);
        this.shipHolderZ.rotation.z = Entity.slowMo(
            this.shipHolderZ.rotation.z, -Math.PI / 2 + this.angleX);

        let rot = this.shipHolderX.rotation.x;
        rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));

        (<any> this).rotation.x = Entity.slowMo((<any> this).rotation.x, rot);

        this.calculateMovement(1);
    }


    public static limitTarget(vector, distX, distY) {
        if (vector.x < -distX) vector.x = -distX;
        if (vector.y < -distY) vector.y = -distY;
        if (vector.x >  distX) vector.x =  distX;
        if (vector.y >  distY) vector.y =  distY;
    }


    public joystickMoved(x: number, y: number) {
        this.joystick.position.x +=  x * 0.01;
        this.joystick.position.y += -y * 0.01;

        Entity.limitTarget(this.joystick.position, 4, 4);
    }


    public joystickPressed() {
        (<any> this).getScene().bulletManager.fire(
            this.ship.getAbsolutePosition(),
            this.direction,
            this.speed + 10,
            100,
        );
    }

    public getCurrentPosition() {
        return this.ship.getAbsolutePosition();
    }


}
