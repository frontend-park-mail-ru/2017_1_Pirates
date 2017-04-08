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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
var entity_1 = __webpack_require__(2);
var EventType_1 = __webpack_require__(0);
var BulletManager_1 = __webpack_require__(4);
var Loader_1 = __webpack_require__(3);
var skydome_1 = __webpack_require__(7);
var SimpleEnemy_1 = __webpack_require__(5);
var MotionScene = (function (_super) {
    __extends(MotionScene, _super);
    function MotionScene(engine) {
        var _this = _super.call(this, engine) || this;
        _this.loadersCount = 0;
        _this.loadersFired = 0;
        _this.entities = [];
        _this.lastEnemy = 0;
        _this.ticks = -1;
        _this.time = 0;
        _this.inMenu = true;
        engine.enableOfflineSupport = false;
        _this.bulletManager = new BulletManager_1.BulletManager(_this);
        // this.map = new Map('motion-map', this);
        _this.last_position = 0;
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.JOYSTICK_MOVE, function (event) {
            _this.currentInput.joystickMoved(event.data.x, event.data.y);
        });
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.JOYSTICK_PRESS, function (event) {
            _this.currentInput.joystickPressed();
        });
        JSWorks.EventManager.subscribe(_this, _this, EventType_1.EventType.RENDER, function (event) {
            // this.onMapEnds();
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
        this.postInit();
        this.skydome = new skydome_1.Skydome('skydome', this);
        this.skydome.position.z = 100;
        this.loader.load();
        this.meshesLoader.load();
        this.shadersLoader.load();
    };
    MotionScene.prototype.postInit = function () {
        this.entities = [];
        this.player = new entity_1.Entity('player', this);
        this.currentInput = this.player;
        this.entities.push(this.player);
    };
    MotionScene.getRandomCoord = function (scater) {
        if (scater === void 0) { scater = 30; }
        return (Math.random() * 2 - 1) * scater;
    };
    MotionScene.prototype.initRandomEnemy = function () {
        var enemy = new SimpleEnemy_1.SimpleEnemy("enemy_" + this.lastEnemy, this);
        enemy.__lived = 0;
        var playerPos = this.currentInput.getAbsolutePosition();
        enemy.position = new BABYLON.Vector3(playerPos.x + MotionScene.getRandomCoord(), playerPos.y + MotionScene.getRandomCoord(), playerPos.z + MotionScene.getRandomCoord() + 200);
        this.entities.push(enemy);
    };
    MotionScene.prototype.render = function () {
        var _this = this;
        if (Math.random() < 0.02) {
            this.initRandomEnemy();
        }
        this.playerAbs = this.currentInput.getAbsolutePosition();
        this.entities.forEach(function (entity, index) {
            if (entity.exploding >= 100) {
                if (!entity.__lived) {
                    return;
                }
                entity.remove();
                _this.entities.splice(index, 1);
                return;
            }
            if (!entity.__lived) {
                return;
            }
            entity.__lived++;
            if (entity.__lived > 10) {
                entity.remove();
                _this.entities.splice(index, 1);
                return;
            }
        });
        if (this.ticks > 50) {
            this.ticks = -1;
        }
        if (this.ticks < 0) {
            // document.title = `Meshes: ${(<any> this).meshes.length}`;
            document.title = "Bullets: " + this.bulletManager.bullets.length;
        }
        this.ticks++;
        _super.prototype.render.call(this);
    };
    MotionScene.prototype.newGame = function () {
        this.currentInput.exploding = -1;
        this.currentInput.health = 50;
        this.currentInput.ship.isVisible = true;
        this.currentInput.target.isVisible = true;
        this.currentInput.explosion.isVisible = false;
        this.currentInput.explosion.scaling = new BABYLON.Vector3(1, 1, 1);
    };
    MotionScene.prototype.loose = function () {
        this.currentInput.health = 0;
        this.currentInput.explode();
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
            _this.time = (new Date()).getMilliseconds();
            _this.emitEvent({ type: EventType_1.EventType.RENDER });
            if (_this.inMenu) {
                _this.currentInput.health = 100;
            }
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


/***/ }),
/* 3 */
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
/* 4 */
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
            if (bullet.__flew > 35) {
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
                if (dist < 4) {
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


/***/ }),
/* 5 */
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
var entity_1 = __webpack_require__(2);
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


/***/ }),
/* 6 */
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
        if (!JSWorks._game.scene.inMenu) {
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
            if (!JSWorks._game.scene.inMenu) {
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
    var game = new Game(document.getElementById('render-canvas'), false);
    JSWorks._game = game;
    window.setTimeout(function () {
        /* const game = new Game(
            <HTMLCanvasElement> document.getElementById('render-canvas'),
            false,
            //{ width: 320, height: 240 }
        );

        JSWorks._game = game; */
        game.run();
    }, 1000);
});


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