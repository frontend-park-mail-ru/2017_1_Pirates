"use strict";
exports.__esModule = true;
var default_1 = require("./scenes/default");
//import BABYLON from './babylon';
window.addEventListener('load', function () {
    var canvas = document.getElementById('render-canvas');
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new default_1.MotionScene(engine);
});
