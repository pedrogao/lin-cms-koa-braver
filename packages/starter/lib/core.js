"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@pedro/core");
class Lin {
    async initApp(app) {
        this['app'] = app;
        // 2. 默认扩展 json logger
        this.applyDefaultExtends();
    }
    applyDefaultExtends() {
        core_1.logging(this['app']);
    }
}
exports.Lin = Lin;
