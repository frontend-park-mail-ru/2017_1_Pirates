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
var Chunk = (function (_super) {
    __extends(Chunk, _super);
    function Chunk(name, scene, widht, height) {
        var _this = _super.call(this, name, scene) || this;
        _this.isActive = false;
        _this.height = 1000;
        _this.width = 1000;
        _this.scene = scene;
        _this.width = widht;
        _this.height = height;
        _this.ground = BABYLON.Mesh.CreateGround('ground', _this.width, _this.height, 25, _this.scene);
        _this.ground.position.z = -2000;
        _this.ground.material = new BABYLON.StandardMaterial('ground', _this.scene);
        /*
        if (this.name === "red") {
            this.ground.material.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        }
        if (this.name === "green") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        }
        if (this.name === "blue") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 1.0);
        }
        */
        // this.ground.material.diffuseColor = new BABYLON.Color3(62 / 255, 73 / 255, 137 / 255);
        _this.ground.material.emissiveColor = new BABYLON.Color3(107 / 255, 118 / 255, 186 / 255);
        _this.ground.material.wireframe = true;
        return _this;
    }
    Chunk.prototype.getScene = function () {
        return this.scene;
    };
    Chunk.prototype.init = function (position) {
        this.ground.position.x = position.x;
        this.ground.position.z = position.z;
        this.ground.position.y = -10;
        this.isActive = true;
    };
    Chunk.prototype.getSize = function () {
        return { h: this.height, w: this.width };
    };
    Chunk.prototype.getBorder = function () {
        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;
        return {
            leftDown: { x: this.ground.position.x - halfWidth, z: this.ground.position.z - halfHeight },
            rightTop: { x: this.ground.position.x + halfWidth, z: this.ground.position.z + halfHeight }
        };
    };
    Chunk.prototype.inArea = function (pos) {
        var border = this.getBorder();
        return (border.leftDown.x <= pos.x) && (pos.x <= border.rightTop.x) && (pos.z >= border.leftDown.z)
            && (pos.z <= border.rightTop.z);
    };
    /**
     * метод проверки входит ли блок в зону видимости
     * @param area
     * @returns {boolean}
     */
    Chunk.prototype.isSeeable = function (area) {
        var border = this.getBorder();
        return (border.rightTop.z >= area.leftDown.z) && (area.rightTop.x >= border.rightTop.x) && (area.leftDown.x <= border.leftDown.x);
        // (border.rightTop.x <= area.rightTop.x);
    };
    return Chunk;
}(BABYLON.Mesh));
exports.Chunk = Chunk;
//# sourceMappingURL=chunk.js.map