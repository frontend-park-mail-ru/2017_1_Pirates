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
var map_1 = require("../map/map");
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
//# sourceMappingURL=scene.js.map