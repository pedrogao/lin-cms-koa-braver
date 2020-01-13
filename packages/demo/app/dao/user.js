/* eslint-disable new-cap */
'use strict';

const { RepeatException, ParametersException, generate, NotFound } = require('@pedro/core');
const { set, has } = require('lodash');
const { UserModel, UserIdentityModel, identityType } = require('../models/user')
const { UserGroupModel } = require('../models/user-group')
const { GroupModel } = require('../models/group')
const sequelize = require('../libs/db')

class UserDao {
  async createUser (v) {
    let user = await UserModel.findOne({
      where: {
        username: v.get('body.username')
      }
    });
    if (user) {
      throw new RepeatException({
        msg: '用户名重复，请重新输入'
      });
    }
    if (v.get('body.email') && v.get('body.email').trim() !== '') {
      user = await UserModel.findOne({
        where: {
          email: v.get('body.email')
        }
      });
      if (user) {
        throw new RepeatException({
          msg: '注册邮箱重复，请重新输入'
        });
      }
    }
    for (const id of (v.get('body.group_ids') || [])) {
      const group = await GroupModel.findByPk(id);
      if (!group) {
        throw new NotFound({
          msg: '分组不存在，无法新建用户',
          errorCode: 10023
        });
      }
    }
    await this.registerUser(v);
  }

  async updateUser (ctx, v) {
    let user = ctx.currentUser;
    if (v.get('body.email') && user.email !== v.get('body.email')) {
      const exit = await ctx.manager.userModel.findOne({
        where: {
          email: v.get('body.email')
        }
      });
      if (exit) {
        throw new ParametersException({
          msg: '邮箱已被注册，请重新输入邮箱'
        });
      }
      user.email = v.get('body.email');
    }
    if (v.get('body.nickname')) {
      user.nickname = v.get('body.nickname')
    }
    user.save();
  }

  async getAuths (ctx) {
    let user = ctx.currentUser;
    let auths = await ctx.manager.authModel.findAll({
      where: {
        group_id: user.group_id
      }
    });
    let group = await ctx.manager.groupModel.findOne({
      where: {
        id: user.group_id
      }
    })
    const aus = this.splitAuths(auths);
    set(user, 'auths', aus);
    if (group) {
      set(user, 'groupName', group.name);
    }
    return user;
  }

  splitAuths (auths) {
    let tmp = {};
    auths.forEach(au => {
      if (!has(tmp, au['module'])) {
        tmp[au['module']] = [
          {
            module: au['module'],
            auth: au['auth']
          }
        ];
      } else {
        tmp[au['module']].push({
          module: au['module'],
          auth: au['auth']
        });
      }
    });
    const aus = Object.keys(tmp).map(key => {
      let tm1 = Object.create(null);
      set(tm1, key, tmp[key]);
      return tm1;
    });
    return aus;
  }

  async registerUser (v) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const user = {
        username: v.get('body.username')
      };
      if (v.get('body.email') && v.get('body.email').trim() !== '') {
        user.email = v.get('body.email');
      }
      const { id: user_id } = await UserModel.create(
        user,
        {
          transaction
        }
      );
      await UserIdentityModel.create(
        {
          user_id,
          identity_type: identityType,
          identifier: user.username,
          credential: generate(v.get('body.password'))
        },
        {
          transaction
        }
      );
      for (const id of (v.get('body.group_ids') || [])) {
        await UserGroupModel.create(
          {
            user_id,
            group_id: id
          },
          {
            transaction
          }
        );
      }
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
    }
    return true;
  }
}

module.exports = { UserDao };
