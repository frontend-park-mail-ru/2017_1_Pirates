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
var entity_1 = require("./entity");
var SimpleEnemy = (function (_super) {
    __extends(SimpleEnemy, _super);
    function SimpleEnemy(name, scene) {
        var _this = _super.call(this, name, scene, false) || this;
        _this.fired = false;
        _this.firedCount = 0;
        _this.speed *= -1 * Math.random() * 0.1;
        _this.health = 1;
        return _this;
    }
    SimpleEnemy.prototype.onMeshesLoaded = function (event, emitter) {
        _super.prototype.onMeshesLoaded.call(this, event, emitter);
        this.light.setEnabled(false);
        this.ship.rotation.y = Math.PI;
        this.target.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.8);
        this.target.position = new BABYLON.Vector3(0, 0, -5);
    };
    SimpleEnemy.prototype.limitTarget = function (vector, distX, distY) {
    };
    SimpleEnemy.prototype.slowMo = function (prev, value, power) {
        if (power === void 0) { power = 50; }
        var cubicBezier = function (x, p1, p2, p3, p4) {
            var xx = x * x;
            var nx = 1.0 - x;
            var nxnx = nx * nx;
            return nxnx * nx * p1 + 3.0 * nxnx * x * p2 + 3.0 * nx * xx * p3 + xx * x * p4;
        };
        // power = 10 + cubicBezier(Math.abs(prev - value) * 10, 1, .01, .83, .67) * 200;
        return (power * prev + value) / (power + 1);
    };
    SimpleEnemy.prototype.calculateMovement = function (modifier) {
        if (modifier === void 0) { modifier = 1; }
        _super.prototype.calculateMovement.call(this, modifier);
        var playerAbs = this.getScene().playerAbs;
        var thisAbs = this.getAbsolutePosition();
        if (!playerAbs) {
            return;
        }
        var jMatrix = entity_1.Entity.getTranslationMatrix(this).invert();
        var player = playerAbs.clone();
        player.z -= -this.speed - this.bulletSpeed;
        var dst = BABYLON.Vector3.DistanceSquared(playerAbs, thisAbs);
        if (dst < 20000) {
            this.firedCount++;
            if (this.firedCount > 20) {
                this.firedCount = 0;
                this.joystickPressed();
            }
        }
        if (dst < 500) {
            return;
        }
        this.joystick.position = BABYLON.Vector3.TransformCoordinates(player, jMatrix);
        /* if (Math.sin((<any> this).time * 10000) > 0) {
            if (!this.fired) {
                // this.fired = true;
                this.joystickPressed();
            }
        } else {
            this.fired = false;
        } */
    };
    SimpleEnemy.prototype.onRender = function (event, emitter) {
        _super.prototype.onRender.call(this, event, emitter);
    };
    return SimpleEnemy;
}(entity_1.Entity));
exports.SimpleEnemy = SimpleEnemy;
//# sourceMappingURL=SimpleEnemy.js.map