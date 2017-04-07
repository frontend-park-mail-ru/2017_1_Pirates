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
exports.__esModule = true;
var babylon_1 = require("./../babylon");
var MotionScene = (function (_super) {
    __extends(MotionScene, _super);
    function MotionScene(engine) {
        var _this = _super.call(this, engine) || this;
        console.log('scene created! yaaay');
        return _this;
    }
    return MotionScene;
}(babylon_1["default"].Scene));
exports.MotionScene = MotionScene;
