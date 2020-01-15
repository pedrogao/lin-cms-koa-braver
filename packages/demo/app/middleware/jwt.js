const {
  parseHeader,
  NotFound,
  RefreshException,
  TokenType,
} = require('@pedro/core')
const { UserGroupModel } = require('../models/user-group')
const { GroupModel } = require('../models/group')
const { UserModel } = require('../models/user')
const { Op } = require('sequelize');

const GROUP_ROOT = 'root'

/**
 * 将 user 挂在 ctx 上
 */
async function mountUser(ctx) {
  const { identity } = parseHeader(ctx);
  const user = await UserModel.findByPk(identity);
  if (!user) {
    ctx.throw(new NotFound({ msg: '用户不存在' }));
  }
  // 将user挂在ctx上
  ctx.currentUser = user;
}

/**
 * 守卫函数，非超级管理员不可访问
 */
async function adminRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx)

    const userGroup = await UserGroupModel.findAll({
      where: {
        user_id: ctx.currentUser.id
      }
    })
    const groupIds = userGroup.map(v => v.group_id)
    const group = await GroupModel.findOne({
      where: {
        name: GROUP_ROOT,
        id: {
          [Op.in]: groupIds
        }
      }
    })
    if (group) {
      await next();
    } else {
      throw new AuthFailed({ msg: '只有超级管理员可操作' });
    }
  } else {
    await next();
  }
}

/**
 * 守卫函数，用户登陆即可访问
 */
async function loginRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx)

    await next();
  } else {
    await next();
  }
}

/**
 * 守卫函数，用户刷新令牌，统一异常
 */
async function refreshTokenRequiredWithUnifyException(ctx, next) {
  // 添加access 和 refresh 的标识位
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx)

    try {
      await parseHeader(ctx, TokenType.REFRESH);
    } catch (error) {
      throw new RefreshException();
    }
    await next();
  } else {
    await next();
  }
}

module.exports = {
  adminRequired,
  loginRequired,
  refreshTokenRequiredWithUnifyException
}