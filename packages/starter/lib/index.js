'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@pedro/core");
const app_1 = require("./app");
exports.router = app_1.router;
const LocalUploader = require('./extensions/file/localUploader');
exports.LocalUploader = LocalUploader;
/**
 * 启动Koa实例
 * @param port 启动端口
 */
const run = async () => {
    const app = await app_1.createApp();
    const port = core_1.config.getItem('port');
    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
    });
};
exports.run = run;
