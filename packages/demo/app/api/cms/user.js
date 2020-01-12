const { LinRouter, getTokens } =require('@pedro/core');


import {
  RegisterValidator,
  LoginValidator,
  UpdateInfoValidator,
  ChangePasswordValidator,
  AvatarUpdateValidator
} from '../../validators/user';

import { UserModel, UserIdentityModel } from '../../models/user'

// const { UserDao } = require('../../dao/user');

export const user = new LinRouter({
  prefix: '/cms/user'
});

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

