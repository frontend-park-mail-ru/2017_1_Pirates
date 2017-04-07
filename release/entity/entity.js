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
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this.speed = 1.0;
        _this.angleX = 0;
        _this.angleY = 0;
        scene.meshesLoader.queue(_this.modelName, '/game/assets/models/', 'spaceship.obj');
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.MESHES_LOAD, function (event, emitter) { _this.onMeshesLoaded(event, emitter); });
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.RENDER, function (event, emitter) { _this.onRender(event, emitter); });
        return _this;
    }
    Entity.prototype.onMeshesLoaded = function (event, emitter) {
        this.shipHolderZ = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'shipHolder'), 0.1, this.getScene());
        this.shipHolderZ.parent = this;
        this.shipHolderZ.isVisible = false;
        this.shipHolderX = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'shipHolder'), 0.1, this.getScene());
        this.shipHolderX.parent = this.shipHolderZ;
        this.shipHolderX.isVisible = false;
        this.ship = this.getScene().meshesLoader.retrieve(this.modelName);
        this.ship = this.ship.clone(scene_1.MotionScene.descendantName(this.name, 'ship'));
        this.ship.parent = this.shipHolderX;
        this.ship.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.ship.rotation = new BABYLON.Vector3(3 * Math.PI / 2, 0, Math.PI);
        this.ship.setEnabled(true);
        this.ship.material = new BABYLON.StandardMaterial('ship', this.getScene());
        this.ship.material.emissiveColor = new BABYLON.Color3(107 / 255, 118 / 255, 186 / 255);
        this.camera = new BABYLON.TargetCamera(scene_1.MotionScene.descendantName(this.name, 'ship'), new BABYLON.Vector3(0, 0, 0), this.getScene());
        this.camera.parent = this;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.position = new BABYLON.Vector3(0, 1, -5);
        this.camera.noRotationConstraint = true;
        this.joystick = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'ship'), 0.1, this.getScene());
        this.joystick.parent = this;
        this.joystick.position = new BABYLON.Vector3(0, 0, 5);
        this.joystick.isVisible = false;
        this.target = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'ship'), 0.1, this.getScene());
        this.target.parent = this.shipHolderX;
        this.target.position = new BABYLON.Vector3(0, 0, 5);
        this.target.isVisible = false;
        this.light = new BABYLON.HemisphericLight(scene_1.MotionScene.descendantName(this.name, 'light'), new BABYLON.Vector3(0, 5, 1), this.getScene());
        this.light.parent = this;
        // this.light.diffuse = new BABYLON.Color3(135 / 255, 69 / 255, 203 / 255);
        this.light.diffuse = new BABYLON.Color3(69 / 255, 110 / 255, 203 / 255);
        this.light.intensity = 0.8;
    };
    Entity.slowMo = function (prev, value, power) {
        if (power === void 0) { power = 50; }
        return (power * prev + value) / (power + 1);
    };
    Entity.getTranslationMatrix = function (node, mul, scaling, position, rotation) {
        return BABYLON.Matrix.Compose(scaling || (node || {}).scaling || new BABYLON.Vector3(1, 1, 1), BABYLON.Quaternion.RotationYawPitchRoll(rotation || ((node || {}).rotation || {}).y || 0, rotation || ((node || {}).rotation || {}).x || 0, rotation || ((node || {}).rotation || {}).z || 0), (position || (node || {}).position || BABYLON.Vector3.Zero()).scale(mul || 1));
    };
    Entity.prototype.calculateMovement = function (modifier) {
        if (modifier === void 0) { modifier = 1; }
        var xMatrix = Entity.getTranslationMatrix(this.shipHolderX);
        var zMatrix = Entity.getTranslationMatrix(this.shipHolderZ);
        var tMatrix = BABYLON.Matrix.Compose(new BABYLON.Vector3(1, 1, 1), BABYLON.Quaternion.RotationYawPitchRoll(0, this.rotation.x, 0), BABYLON.Vector3.Zero());
        this.direction = new BABYLON.Vector3(0, 0, modifier * this.speed);
        // direction.addInPlace(new BABYLON.Vector3(0, this.joystick.position.y / 4 * 0.5, 0));
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, tMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, xMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, zMatrix);
        this.position.x += this.direction.x; // * this.speed;
        this.position.y += this.direction.y; // * this.speed;
        this.position.z += this.direction.z; // * this.speed;
    };
    Entity.acos = function (angle) {
        angle = (angle < -1) ? -1 : angle;
        angle = (angle > 1) ? 1 : angle;
        return Math.acos(angle);
    };
    Entity.prototype.onRender = function (event, emitter) {
        this.ship.isVisible = JSWorks._in_game_ === true;
        this.angleY = Entity.acos(-(this.joystick.position.y / this.joystick.position.z));
        this.angleX = Entity.acos((this.joystick.position.x / this.joystick.position.z) * 1.3);
        this.shipHolderX.rotation.x = Entity.slowMo(this.shipHolderX.rotation.x, Math.PI / 2 - this.angleY);
        this.shipHolderZ.rotation.z = Entity.slowMo(this.shipHolderZ.rotation.z, -Math.PI / 2 + this.angleX);
        var rot = this.shipHolderX.rotation.x;
        rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));
        this.rotation.x = Entity.slowMo(this.rotation.x, rot);
        this.calculateMovement(1);
    };
    Entity.limitTarget = function (vector, distX, distY) {
        if (vector.x < -distX)
            vector.x = -distX;
        if (vector.y < -distY)
            vector.y = -distY;
        if (vector.x > distX)
            vector.x = distX;
        if (vector.y > distY)
            vector.y = distY;
    };
    Entity.prototype.joystickMoved = function (x, y) {
        this.joystick.position.x += x * 0.01;
        this.joystick.position.y += -y * 0.01;
        Entity.limitTarget(this.joystick.position, 4, 4);
    };
    Entity.prototype.joystickPressed = function () {
        this.getScene().bulletManager.fire(this.ship.getAbsolutePosition(), this.direction, this.speed + 10, 100);
    };
    Entity.prototype.getCurrentPosition = function () {
        return this.ship.getAbsolutePosition();
    };
    return Entity;
}(BABYLON.Mesh));
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map