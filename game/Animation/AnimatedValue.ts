import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";


declare const Realm: RealmClass;


export type AnimationFunction = (startValue, endValue, progress: number) => any;


export enum Animation {
    LINEAR,
    BEZIER,
}


export class AnimatedValue<T> {

    private _startValue: any;
    private _endValue: any;
    private _duration: number;
    private _animFunction: Animation;
    public progress: number = 0;
    private _value: any;
    public resolved: boolean = false;
    private _linearDelta: any;
    private startTime: number;


    public get startValue(): T {
        return <T> this._startValue;
    }

    public get endValue(): T {
        return <T> this._endValue;
    }

    public get duration(): number {
        return this._duration;
    }

    public get value(): T {
        return <T> this._value;
    }


    constructor(startValue, endValue, duration: number, animFunc: Animation = Animation.LINEAR) {
        this._startValue = startValue;
        this._endValue = endValue;
        this._duration = duration;
        this._animFunction = animFunc;

        this.init();
    }


    private init(): void {
        this.startTime = RealmClass.now();

        if (typeof this._startValue === 'number') {
            this._linearDelta = (this._endValue - this._startValue) / this.duration;
            this._value = this._startValue;

            return;
        }

        const startVec: BABYLON.Vector3 = <BABYLON.Vector3> this._startValue;
        const endVec: BABYLON.Vector3 = <BABYLON.Vector3> this._endValue;
        this._linearDelta = endVec.subtract(startVec).scale(1 / this.duration);
        this._value = startVec.clone();

        return;
    }


    public onRender(): void {
        if (this.resolved) {
            return;
        }

        this.progress += Realm.timeDelta / this.duration;
        this.animate();

        if (this.progress >= 1) {
            this.resolve();
        }
    }


    private resolve(): void {
        this.resolved = true;
        this._value = this.endValue;
        this.progress = 1;
    }


    private animate(): void {
        switch (this._animFunction) {
            case Animation.LINEAR: return this.animateLinear();
            case Animation.BEZIER: return this.animateBezier();
        }
    }


    private animateLinear(): void {
        if (typeof this._startValue === 'number') {
            this._value += this._linearDelta * Realm.timeDelta;
            return;
        }

        (<BABYLON.Vector3> this._value).addInPlace(this._linearDelta.scale(Realm.timeDelta));
    }


    private animateBezier(): any {
        // ToDo: FIX
        const p0: number = 0.72;
        const p1: number = 0.06;
        const p2: number = 0.28;
        const p3: number = 0.96;
        const curValue: number = AnimatedValue.bezier(this.progress, p0, p1, p2, p3);

        if (typeof this._startValue === 'number') {
            this._value = this._startValue + this._linearDelta * this.duration * curValue;
            return;
        }

        const startVec: BABYLON.Vector3 = <BABYLON.Vector3> this._startValue;
        this._value = startVec.add((<BABYLON.Vector3> this._linearDelta).scale(this.duration * curValue));
    }



    public static resolve<T>(value: T): AnimatedValue<T> {
        const animValue = new AnimatedValue(value, value, 0);
        animValue.resolve();

        return <AnimatedValue<T>> animValue;
    }


    public static bezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
        const mt1: number = (1 - t);
        const mt2: number = mt1**2;

        return mt2*mt1*p0 + 3*t*mt2*p1 + 3*mt1*p2*t**2 + p3*t**3;
    }

}
