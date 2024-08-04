const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const NovelChapter = sequelize.define('novels_chapter', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '章节id'
  },
  roll_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '卷名id'
  },
  novel_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '轻小说id'
  },
  novel_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '小说名称'
  },
  chapter_title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '章节名称'
  },
},{
  timestamps: false,
  indexes: [
    {
      name: "roll_id",
      fields: ['roll_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = NovelChapter