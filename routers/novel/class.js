const NovelInfo = require('../../model/NovelInfo')
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const limit = req.query.limit
  const page = req.query.page
  const className = req.query.className
  const isSerial = req.query.isSerial
  const isAnimation = req.query.isAnimation
  const classTags = req.query.classTags

  const classInfo = {}
  if (className !== '全部' && className) {
    classInfo.className = `${className.replace(/[ ]|[\r\n]/g, '')}`
  }
  // 传入的isSerial 必须是数字 和 必须是1和0
  if (isSerial !== '全部' && isSerial) {
    if (isNaN(parseInt(isSerial))) return res.msg('isSerial传入数据非法')
    if (!(parseInt(isSerial) === 0 || parseInt(isSerial) === 1)) return res.msg('isSerial传入数据非法')
    classInfo.isSerial = parseInt(isSerial)
  }
  // 传入的isAnimation 必须是数字 和 必须是1和0
  if (isAnimation !== '全部' && isAnimation) {
    if (isNaN(parseInt(isAnimation))) return res.msg('isAnimation传入数据非法')
    if (!(parseInt(isAnimation) === 0 || parseInt(isAnimation) === 1)) return res.msg('isAnimation传入数据非法')
    classInfo.isAnimation = parseInt(isAnimation)
  }
  if (classTags !== '全部' && classTags) {
    classInfo.classTags = {
      [Op.like]: `%${classTags.replace(/[ ]|[\r\n]/g, '')}%`
    }
  }

  if (!limit || !page || page <= 0 || limit > 40 || limit <= 0) return res.msg('错误: 请阅读api文档')
  // 传入的limit 和 page 必须是数字
  if (isNaN(parseInt(limit)) || isNaN(parseInt(page))) return res.msg('传入数据非法')

  const { count, rows } = await NovelInfo.findAndCountAll({
    limit: parseInt(limit),
    offset: limit * (page - 1),
    where: classInfo
  }).catch(err => err)
  if (rows instanceof Error) return res.msg('获取失败', 404, rows.name)

  if (rows.length === 0) return res.msg('当前分页轻小说为空')

  const newData = []
  rows.forEach(item => {
    const newItem = item.dataValues
    newItem.classTags = newItem.classTags.split(',')
    newItem.intro = newItem.intro.split('\n')
    newData.push(newItem)
  })

  res.msg('筛选数据成功', 200, {list: newData, count})
}