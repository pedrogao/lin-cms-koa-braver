const sequelize = require('../libs/db')
const { Model, Sequelize } = require('sequelize')

class Permission extends Model {
  
}

Permission.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING({ length: 60 }),
    comment: '权限名称，例如：访问首页',
    allowNull: false
  },
  module: {
    type: Sequelize.STRING({ length: 50 }),
    comment: '权限所属模块，例如：人员管理',
    allowNull: false
  }
},{
  sequelize,
  tableName: 'lin_permission',
  modelName: 'permission',
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