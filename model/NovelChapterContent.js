const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const NovelChapterContent = sequelize.define('novels_chapter_content', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '章节内容id'
  },
  chapter_id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '章节id',
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
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '章节内容'
  },
  pic_content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '章节图片'
  }
},{
  timestamps: false,
  indexes: [
    {
      name: "chapter_id",
      fields: ['chapter_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = NovelChapterContent