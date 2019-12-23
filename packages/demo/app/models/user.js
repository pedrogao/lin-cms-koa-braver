const sequelize = require('../libs/db')
const { Model, Sequelize } = require('sequelize')
const { set, get, has, merge } = require('lodash')

const type = 'USERNAME_PASSWORD'

class UserIdentity extends Model {
  static async verify(username, password) {
    const user = await this.findOne({where: {
        identity_type: type,
        identifier: username,
        delete_time: null
    }})
    
  }
}

UserIdentity.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '用户id'
    },
    identity_type: {
      type: Sequelize.STRING({ length:100 }),
      allowNull: false,
      comment: '登录类型（手机号 邮箱 用户名）或第三方应用名称（微信 微博等）'
    },
    identifier: {
      type: Sequelize.STRING({ length:100 }),
      comment: '标识（手机号 邮箱 用户名或第三方应用的唯一标识）'
    },
    credential: {
      type: Sequelize.STRING({ length:100 }),
      comment: '密码凭证（站内的保存密码，站外的不保存或保存token）'
    }
  },
  {
    sequelize,
    tableName: 'lin_user_identity',
    modelName: 'user_identity',
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    paranoid: true,
    getterMethods: {
      createTime() {
        // @ts-ignore
        return new Date(this.getDataValue('create_time')).getTime();
      },
      updateTime() {
        // @ts-ignore
        return new Date(this.getDataValue('update_time')).getTime();
      }
    }
  }
)

class User extends Model {

  static async verify(nickname, password) {
    const user = await this.findOne({ where: { nickname, delete_time: null } });
    // if (!user) {
    //   throw new NotFound({ msg: '用户不存在' });
    // }
    // if (!user.checkPassword(password)) {
    //   throw new ParametersException({ msg: '密码错误，请输入正确密码' });
    // }
    return user;
  }

  checkPassword(raw) {
    if (!this.password || this.password === '') {
      return false;
    }
    return verify(raw, this.password);
  }

  resetPassword(newPassword) {
    this.password = newPassword;
  }

  changePassword(oldPassword, newPassword) {
    if (this.checkPassword(oldPassword)) {
      this.password = newPassword;
      return true;
    }
    return false;
  }

  toJSON() {
    const origin = {
      id: this.id,
      nickname: this.nickname,
      admin: this.admin,
      active: this.active,
      email: this.email,
      avatar: this.avatar,
      group_id: this.group_id,
      // @ts-ignore
      create_time: this.createTime,
      // @ts-ignore
      update_time: this.updateTime
    };
    // if (has(this, 'auths')) {
    //   return { ...origin, auths: get(this, 'auths', []) };
    // } else if (has(this, 'groupName')) {
    //   return { ...origin, group_name: get(this, 'groupName', '') };
    // } else {
    // }
    return origin;
  }
}

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: {
    type: Sequelize.STRING({ length: 24 }),
    allowNull: false,
    unique: true
  },
  avatar: {
    // 用户默认生成图像，为null
    type: Sequelize.STRING({ length: 500 }),
    comment: '头像url',
    get() {
      // @ts-ignore
      return join(config.getItem('siteDomain', 'assets/', this.getDataValue('avatar')))
    }

  },
  admin: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  active: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  email: {
    type: Sequelize.STRING({ length: 100 }),
    unique: true,
    allowNull: true
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING({ length: 100 }),
    set(ps) {
      // @ts-ignore
      this.setDataValue('password', generate(ps));
    },
    get() {
      // @ts-ignore
      return this.getDataValue('password');
    }
  }
},{
  sequelize,
  modelName: 'user',
  tableName: 'lin_user',
  createdAt: 'create_time',
  updatedAt: 'update_time',
  deletedAt: 'delete_time',
  paranoid: true,
  getterMethods: {
    createTime() {
      // @ts-ignore
      return new Date(this.getDataValue('create_time')).getTime();
    },
    updateTime() {
      // @ts-ignore
      return new Date(this.getDataValue('update_time')).getTime();
    }
  }
})

module.exports = {
  UserModel: User,
  UserIdentityModel: UserIdentity
}