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
//# sourceMappingURL=EventType.js.map