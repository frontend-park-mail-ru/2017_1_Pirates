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
    function Entity(name, scene, first) {
        if (first === void 0) { first = true; }
        var _this = _super.call(this, name, scene) || this;
        _this.speed = 0.3;
        _this.bulletSpeed = 0.1;
        _this.angleX = 0;
        _this.angleY = 0;
        _this.exploding = -1;
        _this.health = 50;
        _this.first = false;
        _this.bulletSpeed = _this.speed * 10;
        _this.first = first;
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.RENDER, function (event, emitter) { _this.onRender(event, emitter); });
        if (!first) {
            _this.onMeshesLoaded(event, undefined);
            return _this;
        }
        scene.meshesLoader.queue(_this.modelName, '/game/assets/models/', 'spaceship.obj');
        JSWorks.EventManager.subscribe(_this, scene, EventType_1.EventType.MESHES_LOAD, function (event, emitter) { _this.onMeshesLoaded(event, emitter); });
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
        if (this.first) {
            this.camera = new BABYLON.TargetCamera(scene_1.MotionScene.descendantName(this.name, 'ship'), new BABYLON.Vector3(0, 0, 0), this.getScene());
            this.camera.parent = this;
            this.camera.setTarget(BABYLON.Vector3.Zero());
            this.camera.position = new BABYLON.Vector3(0, 1, -5);
            this.camera.noRotationConstraint = true;
        }
        this.joystick = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'ship'), 0.1, this.getScene());
        this.joystick.parent = this;
        this.joystick.position = new BABYLON.Vector3(0, 0, 5);
        this.joystick.isVisible = false;
        this.target = new BABYLON.Mesh.CreateBox(scene_1.MotionScene.descendantName(this.name, 'ship'), 0.2, this.getScene());
        this.target.material = new BABYLON.StandardMaterial('target', this.getScene());
        this.target.material.emissiveColor = new BABYLON.Color3(0.8, 1, 0.8);
        this.target.material.emissiveIntensity = 10;
        this.target.material.alpha = 0.2;
        this.target.parent = this.shipHolderX;
        this.target.position = new BABYLON.Vector3(0, 1, 5);
        this.target.isVisible = true;
        this.light = new BABYLON.HemisphericLight(scene_1.MotionScene.descendantName(this.name, 'light'), new BABYLON.Vector3(0, 5, 1), this.getScene());
        this.light.parent = this;
        // this.light.diffuse = new BABYLON.Color3(135 / 255, 69 / 255, 203 / 255);
        this.light.diffuse = new BABYLON.Color3(69 / 255, 110 / 255, 203 / 255);
        this.light.intensity = 0.3;
        this.explosion = new BABYLON.Mesh.CreateSphere('explosion', 100, 30, this.getScene());
        this.explosion.material = new BABYLON.StandardMaterial('expl', this.getScene());
        this.explosion.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        this.explosion.scaling = new BABYLON.Vector3(1, 1, 1);
        this.explosion.parent = this.ship;
        this.explosion.isVisible = false;
    };
    Entity.prototype.slowMo = function (prev, value, power) {
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
        this.direction = new BABYLON.Vector3(0, 0, 1);
        // direction.addInPlace(new BABYLON.Vector3(0, this.joystick.position.y / 4 * 0.5, 0));
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, tMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, xMatrix);
        this.direction = BABYLON.Vector3.TransformCoordinates(this.direction, zMatrix);
        this.direction = this.direction.normalize().scale(modifier * this.speed);
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
        // this.ship.isVisible = JSWorks._in_game_ === true;
        this.angleY = Entity.acos(-(this.joystick.position.y / this.joystick.position.z));
        this.angleX = Entity.acos((this.joystick.position.x / this.joystick.position.z) * 1.3);
        /* this.shipHolderX.rotation.x = Entity.slowMo(
            this.shipHolderX.rotation.x,  Math.PI / 2 - this.angleY);
        this.shipHolderZ.rotation.z = Entity.slowMo(
            this.shipHolderZ.rotation.z, -Math.PI / 2 + this.angleX);

        let rot = this.shipHolderX.rotation.x;
        rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));

        (<any> this).rotation.x = Entity.slowMo((<any> this).rotation.x, rot);*/
        this.shipHolderX.rotation.x = this.slowMo(this.shipHolderX.rotation.x, Math.PI / 2 - this.angleY);
        this.shipHolderX.rotation.y = this.slowMo(this.shipHolderX.rotation.y, Math.PI / 2 - this.angleX);
        this.shipHolderX.rotation.z = this.slowMo(this.shipHolderX.rotation.z, (-Math.PI / 2 + this.angleX) * 2, 25);
        var rot = this.shipHolderX.rotation.x;
        rot = rot - rot * Math.abs(Math.sin(this.shipHolderZ.rotation.z));
        this.rotation.x = this.slowMo(this.rotation.x, rot);
        this.calculateMovement(1);
        if (this.exploding >= 0) {
            this.exploding++;
            this.explosion.scaling.scaleInPlace(1.01);
            this.explosion.material.alpha = (100 - this.exploding) * 0.01;
            if (this.exploding > 100) {
                this.exploding = 100;
            }
        }
    };
    Entity.prototype.emitEvent = function (event) { };
    ;
    Entity.prototype.limitTarget = function (vector, distX, distY) {
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
        if (this.exploding >= 0) {
            return;
        }
        this.joystick.position.x += x * 0.005;
        this.joystick.position.y += -y * 0.012;
        this.limitTarget(this.joystick.position, 4, 4);
    };
    Entity.prototype.joystickPressed = function () {
        if (this.exploding >= 0) {
            return;
        }
        this.getScene().bulletManager.fire(this.ship.getAbsolutePosition(), this.direction, this.bulletSpeed);
    };
    Entity.prototype.getCurrentPosition = function () {
        return this.ship.getAbsolutePosition();
    };
    Entity.prototype.remove = function () {
        this.getScene().removeMesh(this.shipHolderZ);
        this.getScene().removeMesh(this.shipHolderX);
        this.getScene().removeMesh(this.ship);
        this.getScene().removeMesh(this.camera);
        this.getScene().removeMesh(this.target);
        this.getScene().removeMesh(this.joystick);
        this.getScene().removeMesh(this.light);
        this.getScene().removeMesh(this.explosion);
        this.getScene().removeMesh(this);
        this.shipHolderZ.dispose(true);
        this.shipHolderX.dispose(true);
        this.ship.dispose(true);
        this.camera.dispose(true);
        this.target.dispose(true);
        this.joystick.dispose(true);
        this.light.dispose(true);
        this.explosion.dispose(true);
        this.dispose(true);
    };
    Entity.prototype.explode = function () {
        this.health--;
        if (this.health > 0) {
            return;
        }
        if (this.exploding === -1) {
            this.exploding = 0;
            this.ship.isVisible = false;
            this.explosion.isVisible = true;
            this.target.isVisible = false;
            return;
        }
    };
    return Entity;
}(BABYLON.Mesh));
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map