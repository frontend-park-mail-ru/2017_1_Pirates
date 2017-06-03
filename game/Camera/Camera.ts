import BABYLON from "../../static/babylon";
import {Animator, AnimationAction} from "../Animation/Animator";
import {RealmClass} from "../Realm/Realm";
import {StarShip} from "../Models/StarShip";


declare const Realm: RealmClass;



export enum CameraMode {
    DIRECTION,
    FOLLOWING,
}


export interface IFollowable extends BABYLON.Mesh {
    readonly direction: BABYLON.Vector3;
}


export class ExplosionAnimationAction {

    private amplitude: number = 0;
    private maxAmplitude: number;
    private amplitudeStep: number;
    private lag: number = 0.2;

    private srcPosition: BABYLON.Vector3;
    private calcPosition: BABYLON.Vector3;
    private lastCalcPosition: BABYLON.Vector3;
    private nTimes: number = 3;
    private n: number = this.nTimes;


    public static create(power: number, duration: number): AnimationAction {
        const action: ExplosionAnimationAction = new ExplosionAnimationAction();
        action.maxAmplitude = power;
        action.amplitudeStep = power / (duration * action.lag * 60);

        return new AnimationAction(action, duration);
    }


    private animateAmplitude(): void {
        if (this.amplitude === 0) {
            this.amplitude = this.maxAmplitude;
        }

        this.amplitude = Realm.calculateLag(this.amplitude, 0, 20);
    }


    public animateFrame(mesh: BABYLON.Mesh): void {
        this.animateAmplitude();

        if ((<AnimationAction> (<any> this)).animatingLastFrames(this.nTimes)) {
            mesh.position = Realm.calculateVectorAnim(this.calcPosition, mesh.position, this.srcPosition,
                    this.nTimes);
            return;
        }

        if (this.n === this.nTimes) {
            this.n = 0;

            this.lastCalcPosition = this.calcPosition || mesh.position;

            this.calcPosition = new BABYLON.Vector3(
                this.srcPosition.x + this.getRandom(),
                this.srcPosition.y + this.getRandom(),
                this.srcPosition.z + this.getRandom(),
            );
        }

        this.n++;
        mesh.position = Realm.calculateVectorAnim(this.lastCalcPosition, mesh.position, this.calcPosition, this.nTimes);
    }

    public getRandom(): number {
        return Math.random() * (this.amplitude * 2) - this.amplitude;
    }

    public onBefore(mesh: BABYLON.Mesh): void {
        this.srcPosition = mesh.position.clone();
    }

    public onAfter(mesh: BABYLON.Mesh): void {
        mesh.position = this.srcPosition;
    }

}


export class Camera extends BABYLON.Mesh {

    public camera: BABYLON.TargetCamera;
    public limited: boolean = false;

    private followsMesh: StarShip;
    public followLag: number = 16;
    public alignLag: number = 10;

    private mode: CameraMode = CameraMode.DIRECTION;
    private alignVector: BABYLON.Vector3 = BABYLON.Axis.X.negate();
    public animator: Animator;


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene);

        //this.camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 1, BABYLON.Vector3.Zero(), scene);
        this.camera = new BABYLON.TargetCamera('camera', BABYLON.Vector3.Zero(), scene);
        this.camera.setTarget(BABYLON.Axis.X.negate());
        this.camera.parent = this;
        this.animator = new Animator(this);
    }


    public follow(mesh: StarShip): void {
        this.mode = CameraMode.FOLLOWING;

        this.followsMesh = mesh;
    }

    /*public immediateFollow(position): void {
        this.onFollow(0, 0);
    }*/

    public initLookAtDirection(alpha: number): void {
        this.lookAtDirection(alpha);

        this.camera.setTarget(this.alignVector);
    }


    public lookAtDirection(alpha: number): void {
        this.mode = CameraMode.DIRECTION;

        this.followsMesh = undefined;

        const rotMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationY(alpha);
        this.alignVector = BABYLON.Vector3.TransformCoordinates(BABYLON.Axis.X.negate(), rotMatrix);
    }


    public onRender(): void {
        this.animator.onRender();

        switch (this.mode) {

            case CameraMode.DIRECTION: {
                this.camera.position = Realm.calculateVectorLag(this.camera.position, BABYLON.Vector3.Zero(),
                        this.alignLag);

                this.camera.setTarget(Realm.calculateVectorLag(this.camera.getTarget(),
                        this.alignVector, this.alignLag));
            } break;


            case CameraMode.FOLLOWING: {
                this.onFollow(this.followsMesh.position, this.followsMesh.cameraDirection);
            } break;

        }
    }


    public explosionAnimate(power: number, duration: number): void {
        this.animator.addAnimationAction(ExplosionAnimationAction.create(power, duration));
    }


    private onFollow(position: BABYLON.Vector3, direction: BABYLON.Vector3,
                     alignLag: number = this.alignLag, followLag: number = this.followLag): void {
        let offset: BABYLON.Vector3 = direction.clone().scale(1.1 * Realm.animModifier);
        offset.y -= 1.8; // 0.8

        if (this.limited && BABYLON.Vector3.DistanceSquared(this.camera.position, position) > 100
                    || !this.limited) {
            this.camera.position = Realm.calculateVectorLag(this.camera.position,
                    position.subtract(offset), followLag);
        }

        this.camera.setTarget(Realm.calculateVectorLag(this.camera.getTarget(),
            position.add(
                new BABYLON.Vector3(-0.2, 1.6, 0)
            ), alignLag));
    }

}
