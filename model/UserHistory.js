const { DataTypes } = require('sequelize')
const sequelize = require('../db');

const UserHistory = sequelize.define('users_history', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '历史id'
  },
  user_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    comment: '用户id',
  },
  novel_id_list: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: '历史小说id集合'
  }
}, {
  timestamps: false,
  indexes: [
    {
      name: "user_id",
      fields: ['user_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = UserHistory