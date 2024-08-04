const { DataTypes } = require('sequelize')
const sequelize = require('../db');

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '评论id'
  },
  user_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '用户id'
  },
  novel_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '轻小说id'
  },
  comment_content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '小说评论内容'
  },
  comment_praise: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    defaultValue: 0,
    comment: '评论点赞'
  },
}, {
  indexes: [
    {
      name: "novel_id",
      fields: ['novel_id'],
      using: ['BTREE']
    },
    {
      name: "user_id",
      fields: ['user_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = Comment