const sequelize = require('../core/db')
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
    type: Sequelize.STRING({ length: 60 })
  },
  info: {
    type: Sequelize.STRING({ length: 255 }),
    allowNull: true
  }
},{
  sequelize,
  tableName: 'lin_group',
  createdAt: false,
  updatedAt: false
})