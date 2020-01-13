const { parseHeader } = require('@pedro/core')
const { UserGroupModel } = require('../models/user-group')
const { GroupModel } = require('../models/group')
const { Op } = require('sequelize');

const GROUP_ROOT = 'root'

/**
 * 守卫函数，非超级管理员不可访问
 */
async function adminRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    const { identity } = await parseHeader(ctx);
    const userGroup = await UserGroupModel.findAll({
      where: {
        user_id: identity
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
    if (group && group.name === GROUP_ROOT) {
      await next();
    } else {
      throw new AuthFailed({ msg: '只有超级管理员可操作' });
    }
  } else {
    await next();
  }
}

module.exports = {
  adminRequired
}