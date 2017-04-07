/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["MESHES_LOAD"] = 0] = "MESHES_LOAD";
    EventType[EventType["SHADERS_LOAD"] = 1] = "SHADERS_LOAD";
    EventType[EventType["LOAD_SUCCESS"] = 2] = "LOAD_SUCCESS";
    EventType[EventType["LOAD_FAIL"] = 3] = "LOAD_FAIL";
    EventType[EventType["MESHES_FAIL"] = 4] = "MESHES_FAIL";
    EventType[EventType["SHADERS_FAIL"] = 5] = "SHADERS_FAIL";
    EventType[EventType["RENDER"] = 6] = "RENDER";
    EventType[EventType["JOYSTICK_MOVE"] = 7] = "JOYSTICK_MOVE";
    EventType[EventType["JOYSTICK_PRESS"] = 8] = "JOYSTICK_PRESS";
    EventType[EventType["MAP_ENDS"] = 9] = "MAP_ENDS";
})(EventType = exports.EventType || (exports.EventType = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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
var entity_1 = __webpack_require__(4);
var EventType_1 = __webpack_require__(0);
var BulletManager_1 = __webpack_require__(3);
var Loader_1 = __webpack_require__(2);
var skydome_1 = __webpack_require__(8);
var map_1 = __webpack_require__(7);
var MotionScene = (function (_super) {
    __extends(MotionScene, _super);
    function MotionScene(engine) {
        var _this = _super.call(this, engine) || this;
        _this.loadersCount = 0;
        _this.loadersFired = 0;
        _this.entities = [];
        engine.enableOfflineSupport = false;
        _this.bulletManager = new BulletManager_1.BulletManager(_this);
        _this.map = new map_1.Map('motion-map', _this);
        _this.last_position = 0;
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.JOYSTICK_MOVE, function (event) {
            _this.currentInput.joystickMoved(event.data.x, event.data.y);
        });
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.JOYSTICK_PRESS, function (event) {
            _this.currentInput.joystickPressed();
        });
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.RENDER, function (event) {
            _this.onMapEnds();
        });
        return _this;
    }
    MotionScene.prototype.initMeshesLoader = function () {
        var _this = this;
        this.meshesLoader = new Loader_1.Loader(this.loader);
        this.loadersCount++;
        this.meshesLoader.taskAdder = function (self, name, root, file) {
            return self.loader.addMeshTask(name, '', root, file);
        };
        this.meshesLoader.resultGetter = function (self, task) {
            task.loadedMeshes[0].setEnabled(false);
            return task.loadedMeshes[0];
        };
        JSWorks.EventManager.subscribe(this, this.meshesLoader, EventType_1.EventType.LOAD_SUCCESS, function () {
            _this.onLoaderSuccess();
        });
    };
    MotionScene.prototype.initShadersLoader = function () {
        var _this = this;
        this.shadersLoader = new Loader_1.Loader(this.loader);
        this.loadersCount++;
        this.shadersLoader.taskAdder = function (self, name, root, file) {
            return self.loader.addTextFileTask(name, root + "/" + file);
        };
        this.shadersLoader.resultGetter = function (self, task) {
            BABYLON.Effect.ShadersStore[task.name] = task.text;
            return task.text;
        };
        JSWorks.EventManager.subscribe(this, this.shadersLoader, EventType_1.EventType.LOAD_SUCCESS, function () {
            _this.onLoaderSuccess();
        });
    };
    MotionScene.prototype.onLoaderSuccess = function () {
        var _this = this;
        this.loadersFired++;
        if (this.loadersCount === this.loadersFired) {
            [EventType_1.EventType.MESHES_LOAD, EventType_1.EventType.SHADERS_LOAD].forEach(function (type) {
                _this.emitEvent({ type: type });
            });
            this.run();
        }
    };
    MotionScene.prototype.init = function () {
        this.loader = new BABYLON.AssetsManager(this);
        this.initMeshesLoader();
        this.initShadersLoader();
        this.player = new entity_1.Entity('player', this);
        this.currentInput = this.player;
        this.entities.push(this.player);
        this.skydome = new skydome_1.Skydome('skydome', this);
        this.skydome.position.z = 100;
        this.map.loadChunks();
        this.map.initStartChunks();
        this.loader.load();
        this.meshesLoader.load();
        this.shadersLoader.load();
    };
    MotionScene.prototype.run = function () {
        var _this = this;
        this.setActiveCameraByName(this.player.camera.name);
        this.player.camera.attachControl(this.getEngine().getRenderingCanvas(), true);
        this.meshes.forEach(function (mesh) {
            if (mesh.__skybox__) {
                mesh.renderingGroupId = 0;
                return;
            }
            mesh.renderingGroupId = 1;
        });
        this.getEngine().runRenderLoop(function () {
            _this.emitEvent({ type: EventType_1.EventType.RENDER });
            _this.render();
        });
    };
    MotionScene.descendantName = function (parentName, name) {
        return parentName + "__" + name;
    };
    /**
     * метод проверки долетел ли игрок на край текущего блока, если да эмиттим событие MAP_ENDS
     */
    MotionScene.prototype.onMapEnds = function () {
        var shipPosition = this.player.getCurrentPosition();
        var border = this.map.activeChunk.getBorder();
        if ((shipPosition.z >= border.rightTop.z) || (shipPosition.x <= border.leftDown.x) ||
            (shipPosition.x >= border.rightTop.x)) {
            var potentialArea = {
                leftDown: {
                    x: shipPosition.x - this.map.potentialArea.side / 2,
                    z: shipPosition.z - 10,
                },
                rightTop: {
                    x: shipPosition.x + this.map.potentialArea.side / 2,
                    z: shipPosition.z + this.map.potentialArea.front,
                },
            };
            this.emitEvent({ type: EventType_1.EventType.MAP_ENDS, data: { visibleArea: potentialArea, shipPosition: shipPosition } });
        }
    };
    MotionScene.prototype.getPlayer = function () {
        return this.player;
    };
    return MotionScene;
}(BABYLON.Scene));
exports.MotionScene = MotionScene;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventType_1 = __webpack_require__(0);
var Loader = (function () {
    function Loader(loader) {
        this._count = 0;
        this._loaded = 0;
        this._error = false;
        this._hash = {};
        this.taskAdder = function () { };
        this.resultGetter = function () { return null; };
        this.loader = loader;
    }
    Object.defineProperty(Loader.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Loader.prototype.retrieve = function (name) {
        return this._hash[name];
    };
    Loader.prototype.load = function () {
        if (this._count === 0) {
            this.emitEvent({ type: EventType_1.EventType.LOAD_SUCCESS });
        }
    };
    Loader.prototype.queue = function (name, root, file) {
        var _this = this;
        if (this._hash[name]) {
            return;
        }
        var task = this.taskAdder(this, name, root, file);
        this._hash[name] = true;
        this._count++;
        task.onSuccess = function (task) {
            _this._loaded++;
            _this._hash[name] = _this.resultGetter(_this, task);
            if ((_this._loaded === _this._count) && !_this._error) {
                _this.emitEvent({ type: EventType_1.EventType.LOAD_SUCCESS });
            }
        };
        task.onError = function (task) {
            _this._error = true;
            _this._hash = {};
            _this._loaded = 0;
            _this._count = 0;
            _this.emitEvent({ type: EventType_1.EventType.LOAD_FAIL });
        };
    };
    return Loader;
}());
exports.Loader = Loader;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventType_1 = __webpack_require__(0);
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
var scene_1 = __webpack_require__(1);
var EventType_1 = __webpack_require__(0);
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var scene_1 = __webpack_require__(1);
var EventType_1 = __webpack_require__(0);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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
var chunk_1 = __webpack_require__(6);
var EventType_1 = __webpack_require__(0);
var Map = (function (_super) {
    __extends(Map, _super);
    function Map(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this.counter = 0;
        _this.chunkSize = { width: 1000, height: 1000, };
        _this.scene = scene;
        _this.loadChunks();
        _this._potentialArea = { side: 1000, front: 1000, };
        JSWorks.EventManager.subscribe(_this, _this.scene, EventType_1.EventType.MAP_ENDS, function (event, emitter) {
            // провеяем какие блоки сейчас активны(попадают в прямоугольник видимости)
            _this.chunks.forEach(function (chunk) {
                if (!chunk.isSeeable(event.data.visibleArea)) {
                    chunk.isActive = false;
                }
            });
            _this.arrangeChunks(event.data.visibleArea, false);
            // определяем текущий активный блок (этот параметр использует сцена, для того чтобы запускать событие
            // MAP_ENDS
            var pos = event.data.shipPosition;
            _this.chunks.forEach(function (chunk) {
                if (chunk.inArea(pos)) {
                    _this.activeChunk = chunk;
                    return;
                }
            });
        });
        return _this;
    }
    Map.prototype.getScene = function () {
        return this.scene;
    };
    /**
     * загрузить блоки
     */
    Map.prototype.loadChunks = function () {
        this.chunks = [
            new chunk_1.Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new chunk_1.Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
        ];
    };
    /**
     * проход по прямоугольной бласти и рендеринг блоков в ней
     * @param visibleArea область, в которой необходимо иметь блоки
     * @param start флаг, помечающий то, что это начальная инициализация
     */
    Map.prototype.arrangeChunks = function (visibleArea, start) {
        for (var z = Math.round(visibleArea.rightTop.z / this.chunkSize.height) * this.chunkSize.height; z >= visibleArea.leftDown.z; z -= this.chunkSize.height) {
            for (var x = Math.round(visibleArea.leftDown.x / this.chunkSize.width) * this.chunkSize.width; x <= visibleArea.rightTop.x; x += this.chunkSize.width) {
                var currentChunkPos = { x: x, z: z };
                // проверка рендерили мы уже область или нет, если да переходим к следующуей итерации
                if (!start && this.isRendered(currentChunkPos)) {
                    // console.log("eee");
                    continue;
                }
                // ищем не активный блок
                for (var i = 0; i < this.chunks.length && this.chunks[this.counter].isActive; i++) {
                    this.counter = (this.counter + 1) % this.chunks.length;
                }
                // ставим его в currentChunkPos
                this.chunks[this.counter].init(currentChunkPos);
                this.counter = (this.counter + 1) % this.chunks.length;
            }
        }
        // обновляем область видимости
        this.visibleArea = visibleArea;
    };
    /**
     * инициализация стартовых блоков
     */
    Map.prototype.initStartChunks = function () {
        var _this = this;
        this.visibleArea = {
            leftDown: { x: 0, z: 0 },
            rightTop: { x: 0, z: 0 }
        };
        this.arrangeChunks({
            leftDown: { x: -this._potentialArea.side / 2, z: 0 },
            rightTop: { x: this._potentialArea.side / 2, z: this._potentialArea.front }
        }, true);
        this.chunks.forEach(function (chunk) {
            if (chunk.inArea(new BABYLON.Vector3(0, 0, 1))) {
                _this._activeChunk = chunk;
                console.log(_this._activeChunk);
                return;
            }
        });
    };
    Object.defineProperty(Map.prototype, "potentialArea", {
        get: function () {
            return this._potentialArea;
        },
        set: function (value) {
            this._potentialArea = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "activeChunk", {
        get: function () {
            return this._activeChunk;
        },
        set: function (value) {
            this._activeChunk = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * проверка на то, рендерилась текущая точка(т.е. находится ли она в текущей зоне видимости)
     * @param pos координаты точки
     * @returns {boolean} true если находится
     */
    Map.prototype.isRendered = function (pos) {
        return (this.visibleArea.leftDown.z < pos.z) && (this.visibleArea.leftDown.x < pos.x)
            && (this.visibleArea.rightTop.z > pos.z) && (this.visibleArea.rightTop.x > pos.x);
    };
    return Map;
}(BABYLON.Mesh));
exports.Map = Map;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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
var scene_1 = __webpack_require__(1);
var EventType_1 = __webpack_require__(0);
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


/***/ })
/******/ ]);
//# sourceMappingURL=application.js.map