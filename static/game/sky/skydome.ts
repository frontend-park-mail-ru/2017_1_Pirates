import {INewable} from '../common/INewable';
import {MotionScene} from '../scenes/scene';
import {EventType} from "../common/EventType";


declare const BABYLON;
declare const JSWorks;


export class Skydome extends (<INewable> BABYLON.Mesh) {

    private cube: any;
    private time: number = 0;


    constructor(name: string, scene: MotionScene) {
        super(name, scene);

        this.cube = new BABYLON.Mesh.CreateBox(
            MotionScene.descendantName((<any> this).name, 'cube'),
            100,
            (<any> this).getScene()
        );

        scene.shadersLoader.queue('spaceFragmentShader', '/game/assets/shaders/', 'space.fragment.glsl');
        scene.shadersLoader.queue('spaceVertexShader', '/game/assets/shaders/', 'space.vertex.glsl');

        JSWorks.EventManager.subscribe(this, scene, EventType.SHADERS_LOAD,
            (event, emitter) => { this.onShadersLoaded(event, emitter); });

        JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
            (event, emitter) => { this.onRender(event, emitter); });
    }


    public onShadersLoaded(event, emitter) {
        /* const texture = new BABYLON.CustomProceduralTexture(
            'space_texture',
            './game/assets/textures/space',
            512,
            (<any> this).getScene()
        );
        texture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        texture.uScale = 8.0;
        texture.vScale = 8.0;

        const material = new BABYLON.StandardMaterial('space_material', (<any> this).getScene());
        material.backFaceCulling = false;
        material.disableLighting = true;
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.reflectionTexture = texture; */

        const material = new BABYLON.ShaderMaterial(
            'space_material',
            (<any> this).getScene(),
            './game/assets/textures/space/custom', {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'time']
            }
        );
        material.backFaceCulling = false;
        material.disableLighting = true;
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.specularColor = new BABYLON.Color3(0, 0, 0);

        this.cube.material = material;
        this.cube.infiniteDistance = true;
        this.cube.__skybox__ = true;
        this.cube.setEnabled(true);
    }


    public onRender(event, emitter) {
        this.cube.material.setFloat('time', this.time);
        // this.cube.material.reflectionTexture = this.cube.material.reflectionTexture.setFloat('uv_scale', 10);
        this.time += 0.016;
    }

}