import BABYLON from "../../static/babylon";
import ShaderMaterial = BABYLON.ShaderMaterial;
import {RealmClass} from "./Realm";
import AbstractMesh = BABYLON.AbstractMesh;


declare const Realm: RealmClass;


export class RealmSky extends BABYLON.Mesh {

    public cube: BABYLON.Mesh;
    public time: number = Math.round(Math.random() * 10000);
    public speed: number = 0.001;


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene);

        const material: BABYLON.ShaderMaterial = new BABYLON.ShaderMaterial(
            'space_material',
            scene,
            '/static/textures/space/custom', {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'time']
            }
        );
        material.backFaceCulling = false;

        this.cube = BABYLON.Mesh.CreateSphere(
            'sky_sphere',
            32,
            100,
            scene,
        );

        this.cube.material = material;
        this.cube.infiniteDistance = true;
        this.cube['__skybox__'] = true;
        this.cube.registerBeforeRender(() => { this.onRender(); });

        const ground: BABYLON.Mesh = BABYLON.Mesh.CreateGround('ground', 1000, 1000, 50, scene);
        ground.position.z = -100;
        ground.material = new BABYLON.StandardMaterial('ground', scene);
        ground.material.wireframe = true;
        ground.isVisible = false;
    }


    public onRender(): void {
        (<ShaderMaterial> this.cube.material).setFloat('time', this.time);
        this.time += Realm.timeDelta * this.speed;
    }

}
