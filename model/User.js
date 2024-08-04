const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户id'
  },
  username: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '密码'
  },
  nickname: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '昵称'
  },
  picture: {
    type: DataTypes.STRING(256),
    allowNull: false,
    comment: '用户头像'
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    comment: '邮箱'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '是否是管理员',
    defaultValue: 0
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '是否删除',
    defaultValue: 0
  }
},{
  indexes: [
    {
      name: "username",
      fields: ['username'],
      using: ['BTREE']
    }
  ]
})

User.sync()
module.exports = User
