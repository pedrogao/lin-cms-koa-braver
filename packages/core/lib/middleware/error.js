"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("../exception/http-exception");
const extend_1 = require("../extend");
const config_1 = require("../config");
/**
 * 全局异常处理中间件
 */
exports.error = (err, ctx) => {
    ctx.type = 'application/json';
    if (err instanceof http_exception_1.HttpException) {
        ctx.status = err.code || 500;
        ctx.body = JSON.stringify({
            code: err.errorCode,
            message: err.msg,
            request: `${ctx.method} ${ctx.req.url}`
        });
    }
    else {
        extend_1.logger.error(err);
        if (config_1.config.isDebug()) {
            ctx.body = JSON.stringify(err);
        }
        else {
            ctx.body = JSON.stringify({
                code: 9999,
                message: '服务器未知错误',
                request: `${ctx.method} ${ctx.req.url}`
            });
        }
    }
};
