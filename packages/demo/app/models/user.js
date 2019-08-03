const sequelize = require('../core/db')
const { Model,Sequelize } = require('sequelize')
const { set, get, has, merge } = require('lodash')

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
  tableName: 'lin_user',
  modelName: 'user',
  createdAt: 'create_time',
  updatedAt: 'update_time',
  deletedAt: 'delete_time',
  paranoid: true
  // getterMethods: {
  //   isAdmin() {
  //     // @ts-ignore
  //     return this.getDataValue('admin') === UserAdmin.ADMIN;
  //   },
  //   isActive() {
  //     // @ts-ignore
  //     return this.getDataValue('active') === UserActive.ACTIVE;
  //   },
  //   createTime() {
  //     // @ts-ignore
  //     return dayjs(this.getDataValue('create_time')).unix() * 1000;
  //   },
  //   updateTime() {
  //     // @ts-ignore
  //     return dayjs(this.getDataValue('update_time')).unix() * 1000;
  //   }
  // }
})