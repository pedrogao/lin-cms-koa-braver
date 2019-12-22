const sequelize = require('../libs/db')
const { Model,Sequelize } = require('sequelize')

class Log extends Model {
  
}

Log.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: Sequelize.STRING({ length: 450 })
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(20)
    },
    status_code: {
      type: Sequelize.INTEGER
    },
    method: {
      type: Sequelize.STRING(20)
    },
    path: {
      type: Sequelize.STRING(50)
    },
    permission: {
      type: Sequelize.STRING(100)
    }
  },
  {
    tableName: 'lin_log',
    modelName: 'log',
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