const { DataTypes } = require('sequelize')
const sequelize = require('../db');

const NovelInfo = sequelize.define('novels', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    comment: '轻小说id'
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: '轻小说名称'
  },
  picUrl: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '轻小说封面'
  },
  author: {
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '轻小说作者'
  },
  className: {
    type: DataTypes.STRING(16),
    allowNull: false,
    comment: '轻小说分类'
  },
  updateTime: {
    type: DataTypes.STRING(16),
    allowNull: false,
    comment: '轻小说更新时间'
  },
  wordCount: {
    type: DataTypes.STRING(16),
    allowNull: false,
    comment: '轻小说字数'
  },
  isSerial: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '轻小说是否连载中'
  },
  isAnimation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '轻小说是否动画化'
  },
  recentChapters: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '轻小说最新章节'
  },
  classTags: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '轻小说分类标签'
  },
  intro: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: '轻小说简介'
  },
  heat: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '轻小说热度浏览量',
    defaultValue: 0
  },
  recommend: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '轻小说推荐量',
    defaultValue: 0
  },
  collect: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    comment: '轻小说收藏量',
    defaultValue: 0
  },
})

module.exports = NovelInfo