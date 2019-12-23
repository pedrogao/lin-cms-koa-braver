require('../helper/initial');
import request from 'supertest';
import { createApp } from '../../app/app';
import { db } from '../../app/libs/db';
import { saveTokens } from '../helper/token';

describe('user-login.test.js', () => {
  let app;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(() => {
    setTimeout(() => {
      db.close();
    }, 500);
  });

  test('测试/cms/user/login 登陆，用户名不存在', async () => {
    const response = await request(app.callback())
      .post('/cms/user/login')
      .send({
        username: 'llllll',
        password: '123456'
      });
    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
  });

  test('测试/cms/user/login 登陆，密码错误', async () => {
    const response = await request(app.callback())
      .post('/cms/user/login')
      .send({
        username: 'pedro',
        password: '147258'
      });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error_code', 10000);
    expect(response.type).toMatch(/json/);
  });

  test('测试/cms/user/login 登陆成功', async () => {
    const response = await request(app.callback())
      .post('/cms/user/login')
      .send({
        username: 'super',
        password: '123456'
      });
    saveTokens(response.body);
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });
});