import { RepeatException, generate, NotFound, Forbidden } from '@pedro/core';
import { UserModel, UserIdentityModel, identityType } from '../models/user';
import { UserGroupModel } from '../models/user-group';
import { GroupPermissionModel } from '../models/group-permission';
import { GroupModel } from '../models/group';

import sequelize from '../libs/db';
import { Op } from 'sequelize';
import { set, has, uniq } from 'lodash';

class UserDao {
  async createUser (v) {
    let user = await UserModel.findOne({
      where: {
        username: v.get('body.username')
      }
    });
    if (user) {
      throw new RepeatException({
        msg: '已经有用户使用了该名称，请重新输入新的用户名',
        errorCode: 10071
      })
    }
    if (v.get('body.email') && v.get('body.email').trim() !== '') {
      user = await UserModel.findOne({
        where: {
          email: v.get('body.email')
        }
      });
      if (user) {
        throw new RepeatException({
          msg: '邮箱已被使用，请重新填入新的邮箱',
          errorCode: 10076
        });
      }
    }
    for (const id of (v.get('body.group_ids') || [])) {
      const group = await GroupModel.findByPk(id);
      if (group.name === 'root') {
        throw new Forbidden({
          msg: 'root分组不可添加用户',
          errorCode: 10073
        });
      }
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
    if (v.get('body.username') && user.username !== v.get('body.username')) {
      const exit = await UserModel.findOne({
        where: {
          username: v.get('body.username')
        }
      });
      if (exit) {
        throw new RepeatException({
          msg: '已经有用户使用了该名称，请重新输入新的用户名',
          errorCode: 10071
        })
      }
      user.username = v.get('body.username')
    }
    if (v.get('body.email') && user.email !== v.get('body.email')) {
      const exit = await UserModel.findOne({
        where: {
          email: v.get('body.email')
        }
      });
      if (exit) {
        throw new RepeatException({
          msg: '邮箱已被使用，请重新填入新的邮箱',
          errorCode: 10076
        });
      }
      user.email = v.get('body.email');
    }
    if (v.get('body.nickname')) {
      user.nickname = v.get('body.nickname')
    }
    if (v.get('body.avatar')) {
      user.avatar = v.get('body.avatar')
    }
    user.save();
  }

  async getInformation (ctx) {
    let user = ctx.currentUser

    const userGroup = await UserGroupModel.findAll({
      where: {
        user_id: user.id
      }
    })
    const groupIds = userGroup.map(v => v.id)
    const groups = await GroupModel.findAll({
      where: {
        id: {
          [Op.in]: groupIds
        }
      }
    })
    set(user, 'groups', groups);
    return user
  }

  async getPermissions (ctx) {
    let user = ctx.currentUser
    const userGroup = await UserGroupModel.findAll({
      where: {
        user_id: user.id
      }
    })
    const groupIds = userGroup.map(v => v.group_id)
    const groupPermission = await GroupPermissionModel.findAll({
      where: {
        group_id: {
          [Op.in]: groupIds
        }
      }
    })
    const permissions = uniq(groupPermission.map(v => v.permission_id))
    set(user, 'permissions', permissions)

    const group = await GroupModel.findOne({
      where: {
        name: 'root',
        id: {
          [Op.in]: groupIds
        }
      }
    });
    set(user, 'admin', group ? true : false)

    return user
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
      // 未指定分组，默认加入游客分组
      if (v.get('body.group_ids').length === 0) {
        const guest = await GroupModel.findOne({
          where: {
            name: 'guest'
          }
        })
        await UserGroupModel.create(
          {
            user_id,
            group_id: guest.id
          }
        )
      } else {
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
      }
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
    }
    return true;
  }
}

export { UserDao }