import BABYLON from "../../static/babylon";
import ShaderMaterial = BABYLON.ShaderMaterial;
import AbstractMesh = BABYLON.AbstractMesh;
import {RealmClass} from "../Realm/Realm";
import {IObject} from "../ObjectFactory/ObjectFactory";
import {Pilot} from "../Pilots/Pilot";
import {AnimatedValue, Animation} from "../Animation/AnimatedValue";
import {OfflineGameState} from "../States/OfflineGameState";


declare const Realm: RealmClass;


export class StarShip extends BABYLON.Mesh implements IObject {

    public ship: BABYLON.Mesh;
    public light: BABYLON.Light;
    public pilot: Pilot;
    public canMove: boolean = true;

    public speed: number = 0;
    public maxSpeed: number = 0.07 * 12;
    public aimLag: number = 20;
    public aimFrames: number = 60;
    public aimTime: number = 1500;
    public flew: number = 0;
    public health: number = 0;
    public maxHealth: number = 100;

    public direction: BABYLON.Vector3 = BABYLON.Axis.X.scale(-1);
    public cameraDirection: BABYLON.Vector3 = BABYLON.Axis.X.scale(-1);
    private _aim: BABYLON.Vector3 = BABYLON.Axis.X.scale(-1);
    private localRealAim: AnimatedValue<BABYLON.Vector3> = AnimatedValue.resolve(BABYLON.Axis.X.scale(-1));
    private lastLocalRealAim: BABYLON.Vector3 = BABYLON.Axis.X.scale(-1);
    private zRotation: number = 0;
    private zNextRotation: number = 0;
    private aimResolve;
    private hasLight: boolean;

    public aimYLimit: number;
    public isAI: boolean = false;

    private canvas2d: BABYLON.WorldSpaceCanvas2D;
    private healthBorder: BABYLON.Rectangle2D;
    private healthBar: BABYLON.Rectangle2D;
    public exploded: boolean = false;


    constructor(name: string, scene: BABYLON.Scene, hasLight: boolean = true) {
        super(name, scene);
        this.hasLight = hasLight;

        this.ship = Realm.meshesLoader.retrieve('spaceship').clone('ship');
        this.ship.parent = this;
        this.ship.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        this.ship.rotation = new BABYLON.Vector3(Math.PI, 0.5 * Math.PI, 0.5 * Math.PI);
        this.ship.setEnabled(true);

        if (this.hasLight) {
            this.light = new BABYLON.HemisphericLight(
                'light',
                new BABYLON.Vector3(0, 5, 1),
                this.getScene(),
            );

            this.light.parent = this;
            this.light.diffuse = new BABYLON.Color3(69 / 255, 110 / 255, 203 / 255);
            this.light.intensity = 1.9;
        }


        /*this.canvas2d = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(100, 100), {
            id: 'healthBar',
            worldPosition: new BABYLON.Vector3(0, 2, 0),
            backgroundFill: '#C0C0C0',
        });

        this.healthBorder = new BABYLON.Rectangle2D({
            parent: this.canvas2d,
            width: 100,
            height: 25,
            border: BABYLON.Canvas2D.GetSolidColorBrushFromHex("#FFFFFF"),
            borderThickness: 1,
            zOrder: 1,
        });

        this.healthBorder = new BABYLON.Rectangle2D({
            parent: this.canvas2d,
            width: 100,
            height: 25,
            fill: BABYLON.Canvas2D.GetSolidColorBrushFromHex("#CC0000"),
            zOrder: 2,
        });

        this.canvas2d.worldSpaceCanvasNode.parent = this;*/
    }


    public get aim(): BABYLON.Vector3 {
        return this._aim;
    }

    public set aim(value: BABYLON.Vector3) {
        this._aim = value;

        const newLocalAim: BABYLON.Vector3 = this._aim.subtract(this.position);
        this.localRealAim = new AnimatedValue<BABYLON.Vector3>(this.localRealAim.value, newLocalAim, this.aimTime,
                Animation.LINEAR);
    }


    public shoot(): void {
        Realm.scene.laserSound.play();
        let bulletName: string = 'greenBullet';

        if (this.isAI) {
            bulletName = 'redBullet';
        }

        if (!Realm.objects.hasFree(bulletName)) {
            return;
        }

        (<any> Realm.objects.grab(bulletName)).fire(this, this.position, this.direction);
    }


    public onCreate(): void {
    }


    public atAim(): Promise<any> {
        return new Promise<any>((resolve) => {
            this.aimResolve = () => {
                this.aimResolve = undefined;
                resolve();
            };
        });
    }


    public setImmediateAim(aim: BABYLON.Vector3): void {
        this.aim = aim;
        this.localRealAim = AnimatedValue.resolve(this.localRealAim.endValue);
    }


    public mixAim(aim: BABYLON.Vector3): void {
        this.setImmediateAim(Realm.calculateVectorLag(this.aim, aim, 1));
    }


    public setRoll(roll: number): void {
        if (Math.abs(roll) < 5) {
            roll *= 0.5;
        }

        this.zNextRotation = 1.7 * roll;

        if (this.zNextRotation > Math.PI * 0.4) {
            this.zNextRotation = Math.PI * 0.4;
        }

        if (this.zNextRotation < -Math.PI * 0.4) {
            this.zNextRotation = -Math.PI * 0.4;
        }
    }


    public onRender(): void {
        if (!this.exploded && this.health < 0) {
            this.exploded = true;
            this.setEnabled(false);

            (<OfflineGameState> Realm.state).kills++;
            (<OfflineGameState> Realm.state).explodeAt(this.position);

            return;
        }

        if (this.pilot) {
            this.pilot.think();
        }

        if (!this.isAI) {
            Realm.scene.engineSound.setPlaybackRate(this.speed * 2 + 1.0);
        }

        this.localRealAim.onRender();
        this.lastLocalRealAim = this.localRealAim.value;

        if (this.aimResolve) {
            const newGlobalAim: BABYLON.Vector3 = this.position.add(this.lastLocalRealAim);
            const correct: BABYLON.Vector3 = this._aim.subtract(newGlobalAim);

            this.lastLocalRealAim.addInPlace(correct.scale(0.05 * Math.min(1,
                    this.localRealAim.progress * 1.5)));
        }

        if (this.aimYLimit !== undefined) {
            if (this.lastLocalRealAim.y < this.aimYLimit) {
                this.lastLocalRealAim.y = this.aimYLimit;
            }
        }

        this.direction = Realm.calculateVectorLag(this.direction, this.lastLocalRealAim.clone().normalize(),
                100);
        this.cameraDirection = this.direction.clone();

        this.rotation = Realm.rotationFromDirection(this.direction);

        if (!this.aimResolve) {
            this.zRotation = Realm.calculateLag(this.zRotation, this.zNextRotation, 20);
            this.zNextRotation = Realm.calculateLag(this.zNextRotation, 0, 5);
            this.ship.rotation.x = Realm.calculateLag(this.ship.rotation.x, Math.PI + this.zRotation, 10);

            if (this.rotation.z > 0) {
                this.rotation.z = 0.5 * Math.PI;
            } else {
                this.rotation.z = -0.5 * Math.PI;
            }
        }

        const speed: number = this.canMove ? this.speed : 0;
        this.direction.scaleInPlace(speed * Realm.animModifier);
        this.cameraDirection.scaleInPlace(this.speed * Realm.animModifier);
        this.position.addInPlace(this.direction);

        if (this.aimResolve && this.position.equalsWithEpsilon(this.aim, 0.5)) {
            this.aimResolve();
        }
    }


    public onGrab(): void {
        this.setEnabled(true);
        this.health = this.maxHealth;
        this.exploded = false;

        (<OfflineGameState> Realm.state).ships.push(this);

        if (!this.isAI) {
            Realm.scene.engineSound.play();
        }
    }


    public onFree(): void {
        this.setEnabled(false);

        if (!this.isAI) {
            Realm.scene.engineSound.stop();
        }

        this.direction = BABYLON.Axis.X.scale(-1);
        this.cameraDirection = BABYLON.Axis.X.scale(-1);
        this._aim = BABYLON.Axis.X.scale(-1);
        this.localRealAim = AnimatedValue.resolve(BABYLON.Axis.X.scale(-1));
        this.lastLocalRealAim = BABYLON.Axis.X.scale(-1);
        this.zRotation = 0;
        this.zNextRotation = 0;
        this.position = BABYLON.Vector3.Zero();
        this.rotation = BABYLON.Vector3.Zero();

        if (!Realm.state || !(<OfflineGameState> Realm.state).ships) {
            return;
        }

        (<OfflineGameState> Realm.state).ships.splice(
                (<OfflineGameState> Realm.state).ships.indexOf(this), 1);
    }

    public onDelete(): void {
        this.dispose(true);
    }

}
