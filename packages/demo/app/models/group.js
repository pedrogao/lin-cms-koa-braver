const sequelize = require('../libs/db')
const { Model,Sequelize } = require('sequelize')

class Group extends Model {

}

Group.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING({ length: 60 }),
    allowNull: false,
    comment: '分组名称，例如：搬砖者'
  },
  info: {
    type: Sequelize.STRING({ length: 255 }),
    allowNull: true,
    comment: '分组信息：例如：搬砖的人'
  }
},{
  sequelize,
  tableName: 'lin_group',
  modelName: 'group',
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
  GroupModel: Group,
}