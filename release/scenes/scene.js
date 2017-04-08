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
var entity_1 = require("../entity/entity");
var EventType_1 = require("../common/EventType");
var BulletManager_1 = require("../entity/BulletManager");
var Loader_1 = require("../common/Loader");
var skydome_1 = require("../sky/skydome");
var SimpleEnemy_1 = require("../entity/SimpleEnemy");
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
//# sourceMappingURL=scene.js.map