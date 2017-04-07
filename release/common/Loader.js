"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType_1 = require("./EventType");
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
//# sourceMappingURL=Loader.js.map