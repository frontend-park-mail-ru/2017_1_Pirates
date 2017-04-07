"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var scene_1 = require("../scenes/scene");
var EventType_1 = require("../common/EventType");
var Skydome = (function (_super) {
    __extends(Skydome, _super);
    function Skydome(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this.time = 0;
        _this.cube = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(_this.name, 'cube'), 100, _this.getScene());
        scene.shadersLoader.queue('spaceFragmentShader', '/game/assets/shaders/', 'space.fragment.glsl');
        scene.shadersLoader.queue('spaceVertexShader', '/game/assets/shaders/', 'space.vertex.glsl');
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.SHADERS_LOAD, function (event, emitter) { _this.onShadersLoaded(event, emitter); });
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.RENDER, function (event, emitter) { _this.onRender(event, emitter); });
        return _this;
    }
    Skydome.prototype.onShadersLoaded = function (event, emitter) {
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
        var material = new BABYLON.ShaderMaterial('space_material', this.getScene(), './game/assets/textures/space/custom', {
            attributes: ['position', 'uv'],
            uniforms: ['worldViewProjection', 'time']
        });
        material.backFaceCulling = false;
        material.disableLighting = true;
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        this.cube.material = material;
        this.cube.infiniteDistance = true;
        this.cube.__skybox__ = true;
        this.cube.setEnabled(true);
    };
    Skydome.prototype.onRender = function (event, emitter) {
        this.cube.material.setFloat('time', this.time);
        // this.cube.material.reflectionTexture = this.cube.material.reflectionTexture.setFloat('uv_scale', 10);
        this.time += 0.016;
    };
    return Skydome;
}(BABYLON.Mesh));
exports.Skydome = Skydome;
//# sourceMappingURL=skydome.js.map