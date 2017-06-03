
import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import {IObject} from "../ObjectFactory/ObjectFactory";
import {OfflineGameState} from "../States/OfflineGameState";

declare const Realm: RealmClass;

export class Explosion extends BABYLON.Mesh implements IObject {

    public sphere: any;
    public currentFrame: number = 0;
    public animationTime: number = 100;
    public delta: number;


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene);

        this.sphere = BABYLON.Mesh.CreateSphere(
            'explosion',
            100,
            7,
            scene,
        );

        this.sphere.parent = this;
        this.sphere.material = new BABYLON.StandardMaterial('expl', scene);
        this.sphere.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

        this.sphere.scaling = new BABYLON.Vector3(1, 1, 1);
    }

    onCreate(): void {
        // throw new Error("Method not implemented.");
    }

    onGrab(): void {
        this.currentFrame = 0;
        this.setEnabled(true);
        this.sphere.scaling = new BABYLON.Vector3(1, 1, 1);
    }

    onFree(): void {
        this.setEnabled(false);
    }

    onRender(): void {
        if (!this.isEnabled()) {
            return;
        }

        this.currentFrame++;
        this.sphere.material.alpha = (this.currentFrame / this.animationTime);

        const scale: number = 1 + (this.currentFrame / this.animationTime) * 1.1;
        this.sphere.scaling = new BABYLON.Vector3(scale, scale, scale);

        if (this.animationEnd()) {
            Realm.objects.free('explosion', this);
        }
    }

    onDelete(): void {
        this.dispose(true);
    }

    public animationEnd(): boolean {
        return this.currentFrame >= this.animationTime;
    }

}