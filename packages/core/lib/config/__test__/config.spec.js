"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const config_1 = require("../config");
describe('测试config从环境变量中读取配置', () => {
    it('读取单个', () => {
        // 读取以 LIN开头的
        // 1. 先从环境变量里面去读取 判断何种环境
        // 2. 得到何种环境后，选择去读取什么配置文件
        // 3. 读取配置文件，然后用环境变量去覆盖
        process.env.lin_env = 'debug';
        process.env.lin_log_limit = '10';
        process.env.lin_log_file = 'access.log';
        const config = new config_1.Config();
        config.getConfigFromEnv();
        // @ts-ignore
        console.log(config.store);
        console.log(process.env);
        expect(config.getItem('env')).toBe('debug');
    });
});
