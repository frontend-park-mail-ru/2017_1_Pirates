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
var chunk_1 = require("./chunk");
var EventType_1 = require("../common/EventType");
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
//# sourceMappingURL=map.js.map