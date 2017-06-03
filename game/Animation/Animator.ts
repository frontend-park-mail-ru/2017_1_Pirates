import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";


declare const Realm: RealmClass;


export const ANIMATE_INFINITE: number = -1;



export class AnimationAction {
    private _duration: number;  // milliseconds
    public time: number = 0;
    public frame: number = 0;

    constructor(action, duration: number) {
        for (let field in action) {
            this[field] = action[field];
        }

        this.duration = duration;
    }

    public get duration(): number {
        return this._duration;
    }

    public set duration(value: number) {
        this._duration = value;
    }

    public get frames(): number {
        return Math.floor(this.duration / 1000 * 60);
    }

    public isLastFrame(): boolean {
        if (this.frames === ANIMATE_INFINITE) {
            return false;
        }

        return this.frame >= this.frames;
    }

    public isFirstFrame(): boolean {
        return this.frame === 0;
    }

    public framesBeforeEnd(): number {
        return this.frames - this.frame;
    }

    public animatingLastFrames(n: number): boolean {
        return this.framesBeforeEnd() <= n;
    }

    public animatingFirstFrames(n: number): boolean {
        return this.frame <= n;
    }


    public init(duration: number) {
        this.duration = duration;
    }


    public animateFrame(mesh: BABYLON.Mesh): void {};
    public onBefore(mesh: BABYLON.Mesh): void {};
    public onAfter(mesh: BABYLON.Mesh): void {};
}


export class Animator {

    private actions: AnimationAction[] = [];
    private action: AnimationAction;
    public parent: BABYLON.Mesh;


    constructor(parent: BABYLON.Mesh) {
        this.parent = parent;
    }


    public onRender(): void {
        if (!this.action) {
            if (this.actions.length === 0) {
                return;
            }

            this.action = this.actions[0];
            this.actions.splice(0, 1);

            this.action.time = 0;
            this.action.frame = 0;

            this.action.onBefore(this.parent);
        }

        if (this.action.isLastFrame()) {
            this.action.animateFrame(this.parent);
            this.action.onAfter(this.parent);
            this.action = undefined;

            return;
        }

        this.action.animateFrame(this.parent);
        this.action.time += RealmClass.now();
        this.action.frame += 1;
    }


    public addAnimationAction(action: AnimationAction): void {
        this.actions.push(action);
    }

}
