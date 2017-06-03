import BABYLON from "../../../static/babylon";
import {RealmClass} from "../../Realm/Realm";
import {IObject} from "../../ObjectFactory/ObjectFactory";
import {TrafficLine} from "./TrafficLine";
import {TrafficSection} from "./TrafficSection";
import {Building} from "../Building";
import {Random} from "../../Utils/Random";
import StandardMaterial = BABYLON.StandardMaterial;
import {OfflineGameState} from "../../States/OfflineGameState";


declare const Realm: RealmClass;


export class BonusRing extends BABYLON.Mesh implements IObject {

    public static readonly color: BABYLON.Color3 = new BABYLON.Color3(100/255, 187/255, 100/255);
    public ring: BABYLON.Mesh;
    public collected: boolean = false;


    constructor(scene: BABYLON.Scene) {
        super('', scene);

        this.ring = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 16, scene, false);
        this.ring.material = new BABYLON.StandardMaterial('material', scene);
        this.ring.parent = this;

        (<any> this.ring.material).diffuseColor = BonusRing.color;
        (<any> this.ring.material).emissiveColor = BonusRing.color;
        (<any> this.ring.material).emissiveIntensity = 0.5;
    }


    public onCreate(): void {
    }

    public onGrab(): void {
    }

    public onFree(): void {
    }

    public onRender(): void {
        if (this.collected) {
            this.ring.isVisible = false;
            return;
        }

        this.ring.isVisible = true;
        const dstSquared: number = BABYLON.Vector3.DistanceSquared(this.position,
                Realm.getLeadingPlayer().position);
        const dstSquaredMax: number = 40**2;

        if (dstSquared > dstSquaredMax) {
            this.ring.isVisible = false;
            return;
        }

        this.ring.material.alpha = 0.5 - (dstSquared / dstSquaredMax) * 0.5;

        if (this.ring.material.alpha > 0.5) {
            this.ring.material.alpha = 0.5;
        }

        if (this.ring.material.alpha < 0) {
            this.ring.material.alpha = 0;
        }

        if (dstSquared < 3 && !this.collected) {
            this.collected = true;
            Realm.scene.bonusSound.play();
            (<OfflineGameState> Realm.state).bonusCollected();
        }
    }

    public onDelete(): void {
    }

}


