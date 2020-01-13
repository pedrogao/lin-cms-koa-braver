'use strict';

import { LinRouter, getTokens } from '@pedro/core';

import {
  RegisterValidator,
  LoginValidator,
} from '../../validators/user';

import { adminRequired } from '../../middleware/admin-required';

import { UserModel, UserIdentityModel } from '../../models/user';

import { UserDao } from '../../dao/user';

const user = new LinRouter({
  prefix: '/cms/user'
});

const userDao = new UserDao();

user.linPost(
  'userRegister',
  '/register',
  {
    auth: '注册',
    module: '用户',
    mount: false
  },
  adminRequired,
  // logger('管理员新建了一个用户'),
  async ctx => {
    const v = await new RegisterValidator().validate(ctx);
    await userDao.createUser(v);
    ctx.success({
      msg: '用户创建成功'
    });
  }
);

user.linPost(
  'userLogin',
  '/login',
  {
    auth: '登陆',
    module: '用户',
    mount: false
  },
  async ctx => {
    const v = await new LoginValidator().validate(ctx);
    let user = await UserIdentityModel.verify(
      v.get('body.username'),
      v.get('body.password')
    );
    const { accessToken, refreshToken } = getTokens(user);
    ctx.json({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }
);

export {
  user
}