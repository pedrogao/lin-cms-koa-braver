"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("../exception");
/**
 * 处理success
 *
 * ```js
 * ctx.success({ msg:"hello from lin!" })
 * ```
 *
 * ```js
 * ctx.success({ code: 200, msg: "hello from lin!", errorCode: 10000 })
 * ```
 *
 * @param app app实例
 */
exports.success = (app) => {
    app.context.success = function (ex) {
        this.type = 'application/json';
        const suc = new exception_1.Success(ex);
        let data = {
            code: suc.errorCode,
            message: suc.msg,
            request: `${this.method} ${this.req.url}`
        };
        this.status = suc.code;
        this.body = JSON.stringify(data);
    };
};
