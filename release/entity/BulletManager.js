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
        if (distance === void 0) { distance = 500; }
        if (this.bullets.length > 160) {
            return;
        }
        this.lastBulletId++;
        var bullet = new BABYLON.Mesh.CreateBox("bullet_" + this.lastBulletId, 0.1, this.getScene());
        bullet.__position = position.clone();
        bullet.__direction = direction.normalize().scale(speed);
        bullet.__speed = speed;
        bullet.__distance = distance;
        bullet.__flew = 0;
        bullet.position = bullet.__position.add(direction.scale(speed * 2));
        bullet.scaling = new BABYLON.Vector3(1.0, 1.0, 100.0);
        bullet.lookAt(bullet.position.add(bullet.__direction));
        bullet.material = new BABYLON.StandardMaterial('bullet_mat', this.getScene());
        bullet.material.emissiveColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        bullet.material.alpha = 0.7;
        bullet.__light = new BABYLON.SpotLight('l', new BABYLON.Vector3(0, 0, -0.5), new BABYLON.Vector3(0, 0, 0.5), 0.05, 2, this.getScene());
        bullet.__light.diffuse = new BABYLON.Color3(1, 0, 0);
        bullet.__light.specular = new BABYLON.Color3(0.5, 0, 0);
        bullet.__light.parent = bullet;
        this.bullets.push(bullet);
    };
    BulletManager.prototype.updateBullets = function (event, emitter) {
        var _this = this;
        var forDeleting = [];
        var spliced = 0;
        this.bullets.forEach(function (bullet, index) {
            bullet.position = bullet.position.add(bullet.__direction);
            bullet.__flew++;
            if (bullet.__flew > 15) {
                bullet.getScene().removeMesh(bullet.__light);
                bullet.__light.dispose(true);
                bullet.getScene().removeMesh(bullet);
                bullet.dispose(true);
                forDeleting.push(index);
                return;
            }
            var abs = bullet.getAbsolutePosition();
            _this.getScene().entities.forEach(function (entity) {
                var dist = BABYLON.Vector3.DistanceSquared(entity.getAbsolutePosition(), abs);
                if (dist < 5) {
                    entity.explode();
                }
            });
        });
        forDeleting.forEach(function (index) {
            _this.bullets.splice(index - spliced, 1);
            spliced++;
        });
    };
    return BulletManager;
}());
exports.BulletManager = BulletManager;
//# sourceMappingURL=BulletManager.js.map