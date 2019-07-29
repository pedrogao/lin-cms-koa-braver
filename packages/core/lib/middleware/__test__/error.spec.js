"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import { request, context, response } from '../../utils';
const koa_1 = tslib_1.__importDefault(require("koa"));
const error_1 = require("../error");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
test('测试error中间件', async () => {
    const app = new koa_1.default();
    app.on('error', error_1.error);
    app.use(async (ctx) => {
        throw new Error('gg');
        ctx.body = 'hello lin';
    });
    const response = await supertest_1.default(app.callback()).get('/');
    // .send({
    //   nickname: 'pedro',
    //   group_id: 1,
    //   password: '123456',
    //   confirm_password: '123455'
    // });
    expect(response.status).toBe(500);
});
