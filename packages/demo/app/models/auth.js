const sequelize = require('../core/db')
const { Model,Sequelize } = require('sequelize')

class Auth extends Model {

}

Auth.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  auth: {
    type: Sequelize.STRING({ length: 60 })
  },
  module: {
    type: Sequelize.STRING({ length: 50 })
  }
},{
  sequelize,
  tableName: 'lin_auth',
  createdAt: false,
  updatedAt: false
})