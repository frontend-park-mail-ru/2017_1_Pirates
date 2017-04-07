"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scene_1 = require("./scenes/scene");
var EventType_1 = require("./common/EventType");
var Game = (function () {
    function Game(canvas, resizable, res) {
        if (resizable === void 0) { resizable = false; }
        this.events = {};
        this.resizable = false;
        this.pointerLocked = false;
        this.resizable = resizable;
        this.canvas = canvas;
        this.initCanvas(res);
        this.scene = new scene_1.MotionScene(this.engine);
        this.events = {
            resize: this.onResize,
            mousemove: this.onPointerMove,
            keydown: this.onKeyDown,
            click: this.onClick,
            pointerlockchange: this.onPointerLockChange,
            mozpointerlockchange: this.onPointerLockChange,
            webkitpointerlockchange: this.onPointerLockChange,
        };
    }
    Game.prototype.run = function () {
        this.scene.init();
        this.initEventListeners();
        this.initCanvasPointerLock();
    };
    Game.prototype.stop = function () {
        this.freeEventListeners();
    };
    Game.prototype.onResize = function (event) {
        if (this.resizable) {
            this.engine.resize();
        }
    };
    Game.prototype.onClick = function (event) {
        // this.pointerLocked = true;
        // this.canvas.requestPointerLock();
        if (JSWorks._in_game_) {
            this.scene.emitEvent({ type: EventType_1.EventType.JOYSTICK_PRESS });
        }
    };
    Game.prototype.onPointerMove = function (event) {
        if (!this.lastMousePos) {
            this.lastMousePos = { x: event.screenX, y: event.screenY };
            return;
        }
        var curMousePos = { x: event.screenX, y: event.screenY, };
        var diffX = event.movementX || this.lastMousePos.x - curMousePos.x;
        var diffY = event.movementY || this.lastMousePos.y - curMousePos.y;
        if (this.pointerLocked) {
            this.scene.emitEvent({ type: EventType_1.EventType.JOYSTICK_MOVE, data: { x: diffX, y: diffY } });
        }
        this.lastMousePos = curMousePos;
    };
    Game.prototype.togglePointerLock = function () {
        this.pointerLocked = !this.pointerLocked;
        if (!this.pointerLocked) {
            document.exitPointerLock();
            return;
        }
        this.canvas.requestPointerLock();
    };
    Game.prototype.onKeyDown = function (event) {
        if (event.keyCode === "L".charCodeAt(0)) {
            if (JSWorks._in_game_) {
                this.togglePointerLock();
            }
        }
    };
    Game.prototype.onPointerLockChange = function (event) {
        var lock = document.pointerLockElement ||
            document.mozPointerLockElement ||
            document.webkitPointerLockElement;
        if (lock !== this.canvas) {
            this.pointerLocked = false;
            return;
        }
        this.pointerLocked = true;
    };
    Game.prototype.initCanvas = function (res) {
        var canvasSize = { height: '100%', width: '100%' };
        if (res) {
            canvasSize.height = res.height.toString() + "px" || canvasSize.height;
            canvasSize.width = res.width.toString() + "px" || canvasSize.width;
        }
        this.canvas.style.height = canvasSize.height;
        this.canvas.style.width = canvasSize.width;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    };
    Game.prototype.initEventListeners = function () {
        var _this = this;
        this.genericWindowEventReceiver = function (event) {
            _this.events[event.type].bind(_this)(event);
        };
        Object.keys(this.events).forEach(function (type) {
            window.addEventListener(type, _this.genericWindowEventReceiver, false);
        });
    };
    Game.prototype.freeEventListeners = function () {
        var _this = this;
        Object.keys(this.events).forEach(function (type) {
            window.removeEventListener(type, _this.genericWindowEventReceiver);
        });
    };
    Game.prototype.initCanvasPointerLock = function () {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
            this.canvas.mozRequestPointerLock ||
            this.canvas.webkitRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock ||
            document.mozRequestPointerLock ||
            document.webkitRequestPointerLock;
    };
    return Game;
}());
JSWorks.__router_disabled__ = true;
window.addEventListener('load', function () {
    window.setTimeout(function () {
        var game = new Game(document.getElementById('render-canvas'), false);
        game.run();
    }, 1000);
});
//# sourceMappingURL=game.js.map