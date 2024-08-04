const { DataTypes } = require('sequelize')
const sequelize = require('../db');

const CommentReply = sequelize.define('comments_reply', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '回复评论id'
  },
  user_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '用户id'
  },
  comment_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '父评论id'
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
      name: "user_id",
      fields: ['user_id'],
      using: ['BTREE']
    },
    {
      name: "comment_id",
      fields: ['comment_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = CommentReply