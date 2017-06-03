import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import {RealmState} from "../Realm/RealmState";


declare const Realm: RealmClass;


export class TestState extends RealmState {

    public cube: BABYLON.Mesh;
    public holder: BABYLON.Mesh;


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene);

        this.holder = BABYLON.Mesh.CreateBox('holder', 1, scene);
        this.holder.isVisible = false;
        this.holder.parent = this;
        this.holder.renderingGroupId = 1;

        this.cube = BABYLON.Mesh.CreateBox('cube', 1, scene);
        this.cube.position = new BABYLON.Vector3(-5, 0, 0);
        this.cube.material = new BABYLON.StandardMaterial('cube_material', scene);
        this.cube.parent = this.holder;

        const colors: BABYLON.Color3[] = [
            new BABYLON.Color3(1.0, 0.0, 0.0),
            new BABYLON.Color3(0.0, 1.0, 0.0),
            new BABYLON.Color3(0.0, 0.0, 1.0),
        ];

        (<any> this.cube.material).emissiveColor = colors[(<any> Realm).states.size];
        (<any> this.cube.material).diffuseColor = colors[(<any> Realm).states.size];

        this.alpha = ((<any> Realm).states.size - 1) * 0.5 * Math.PI;
        this.repositionOnAlpha();
    }


    public onEnter() {
    }

    public onLeave() {
    }

}