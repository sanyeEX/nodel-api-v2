const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const NovelRoll = sequelize.define('novels_roll', {
  id: {
    type: DataTypes.BIGINT(11),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
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
  roll_title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '小说卷名'
  },
},{
  timestamps: false,
  indexes: [
    {
      name: "novel_id",
      fields: ['novel_id'],
      using: ['BTREE']
    }
  ]
})

module.exports = NovelRoll