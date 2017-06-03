import BABYLON from "../../../static/babylon";
import {RealmClass} from "../../Realm/Realm";
import {IObject} from "../../ObjectFactory/ObjectFactory";
import {Random} from "../../Utils/Random";

declare const Realm: RealmClass;


export class TrafficSection extends BABYLON.Mesh implements IObject {

    public static readonly ACTIVE_COLOR: BABYLON.Color3 = new BABYLON.Color3(211/255, 42/255, 156/255);
    public static readonly INACTIVE_COLOR: BABYLON.Color3 = new BABYLON.Color3(99/255, 43/255, 94/255);

    public shape: BABYLON.Mesh;
    public border: BABYLON.Mesh;
    public length: number;
    public colorProgressStep: number = 0.3;
    public colorProgress: number = 0;
    public hasCrossingAttached: boolean = false;
    public random: Random;
    protected trueLength: number;
    public zAllowed: number = 15;


    constructor(name: string, scene: BABYLON.Scene, parent: BABYLON.Node, length: number, random: Random) {
        super(name, scene, parent);
        this.length = length;
        this.random = random;

        const trueLength: number = this.length * 1.1;
        this.trueLength = trueLength;

        this.shape = BABYLON.Mesh.CreateCylinder(
            'shape',
            trueLength,  // height
            3.2, 3.2,  // diameterTop, diameterBottom
            6,  // tessellation
            1,  // subdivisions
            scene,
        );

        this.shape.position.x = -this.length;
        this.shape.rotation.z = 0.5 * Math.PI;
        //this.shape.material = new BABYLON.StandardMaterial('shapeMaterial', scene);
        this.shape.parent = this;
        /*(<any> this.shape.material).diffuseColor = TrafficSection.INACTIVE_COLOR;
        (<any> this.shape.material).emissiveColor = TrafficSection.ACTIVE_COLOR;
        (<any> this.shape.material).emissiveIntensity = 0.0;*/
        // (<any> this.shape.material).alpha = 0.9;

        this.shape.isVisible = false;
    }


    public afterSection(lastSection: TrafficSection, rotation: BABYLON.Vector3): void {
        this.rotation = rotation;
        this.position = lastSection.position.add(lastSection.getEndVector());

        this.colorProgress = lastSection.colorProgress - lastSection.colorProgressStep;
        if (this.colorProgress < 0) {
            this.colorProgress = Math.PI;
        }
    }


    public getEndVector(): BABYLON.Vector3 {
        const matrix: BABYLON.Matrix = Realm.getTranslationMatrix(this, null, null, BABYLON.Vector3.Zero());
        const vector: BABYLON.Vector3 = new BABYLON.Vector3(-this.length, 0, 0);

        return BABYLON.Vector3.TransformCoordinates(vector, matrix);
    }


    public onCreate(): void {
    }

    public onGrab(): void {
        this.isVisible = true;
    }

    public onFree(): void {
        this.isVisible = false;
        this.hasCrossingAttached = false;
    }

    public onDelete(): void {
        this.dispose(true);
    }

    public onRender(): void {
        // this.colorProgress += this.colorProgressStep;

        if (this.colorProgress > Math.PI) {
            this.colorProgress = 0;
        }
    }

}
