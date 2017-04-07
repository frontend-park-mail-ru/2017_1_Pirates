"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType_1 = require("../common/EventType");
var BulletManager = (function () {
    function BulletManager(scene) {
        var _this = this;
        this.bullets = [];
        this.lastBulletId = 0;
        this.scene = scene;
        JSWorks.EventManager.subscribe(this, scene, EventType_1.EventType.RENDER, function (event, emitter) { _this.updateBullets(event, emitter); });
    }
    BulletManager.prototype.getScene = function () {
        return this.scene;
    };
    BulletManager.prototype.fire = function (position, direction, speed, distance) {
        this.lastBulletId++;
        var bullet = new BABYLON.Mesh.CreateBox("bullet_" + this.lastBulletId, 0.1, this.getScene());
        bullet.__position = position.clone();
        bullet.__direction = direction.clone();
        bullet.__speed = speed;
        bullet.__distance = distance;
        bullet.position = bullet.__position.clone();
        this.bullets.push(bullet);
    };
    BulletManager.prototype.updateBullets = function (event, emitter) {
        var _this = this;
        this.bullets.forEach(function (bullet, index) {
            bullet.position.x += bullet.__direction.x * bullet.__speed;
            bullet.position.y += bullet.__direction.y * bullet.__speed;
            bullet.position.z += bullet.__direction.z * bullet.__speed;
            if (BABYLON.Vector3.Distance(bullet.position, bullet.__position) >= bullet.__distance) {
                bullet.getScene().removeMesh(bullet);
                _this.bullets.splice(index, 1);
            }
        });
    };
    return BulletManager;
}());
exports.BulletManager = BulletManager;
//# sourceMappingURL=BulletManager.js.map