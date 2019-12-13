"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const logger_1 = require("../logger");
const egg_logger_1 = require("egg-logger");
// 默认配置
let options = {
    level: 'INFO',
    dir: 'logs',
    sizeLimit: 1024 * 1024 * 5,
    file: true
};
const logConf = config_1.config.getItem('log');
// 融合配置
options = Object.assign(Object.assign({}, options), logConf);
exports.logger = new egg_logger_1.Logger({});
// 如果file开启，则打开，否则关闭
if (options.file) {
    exports.logger.set('file', 
    // 日志输出到文件
    new logger_1.FileTransport({
        dir: options.dir,
        sizeLimit: options.sizeLimit,
        level: options.level
    }));
}
exports.logger.set('console', 
// 日志输出到终端
new logger_1.ConsoleTransport({
    level: options.level
}));
/**
 * ATTENTION: 需第一时间主动加载配置，然后将 logging 扩展第一时间挂载到ctx原型上
 * 日志扩展
 *
 * ```js
 * ctx.logger.info();
 * ctx.logger.warn();
 * ctx.logger.debug();
 * ctx.logger.error();
 * ```
 *
 * @param app app实例
 */
exports.logging = (app) => {
    app.context.logger = exports.logger;
};
