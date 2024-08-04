const NovelInfo = require('../../model/NovelInfo')
const {Op} = require("sequelize");

module.exports = async (ctx) => {
  const { limit, page, className, isSerial, isAnimation, classTags } = ctx.query

  const classInfo = {}
  if (className !== '全部' && className) {
    if (typeof className !== 'string') return ctx.msg('数据类型非法')
    classInfo.className = `${className ? className.toString().replace(/[ ]|[\r\n]/g, '') : ''}`
  }
  // 传入的isSerial 必须是数字 和 必须是1和0
  if (isSerial !== '全部' && isSerial) {
    if (isNaN(parseInt(isSerial))) return ctx.msg('isSerial传入数据类型非法')
    if (!(parseInt(isSerial) === 0 || parseInt(isSerial) === 1)) return ctx.msg('isSerial只能为0和1')
    classInfo.isSerial = parseInt(isSerial)
  }
  // 传入的isAnimation 必须是数字 和 必须是1和0
  if (isAnimation !== '全部' && isAnimation) {
    if (isNaN(parseInt(isAnimation))) return ctx.msg('isAnimation传入数据类型非法')
    if (!(parseInt(isAnimation) === 0 || parseInt(isAnimation) === 1)) return ctx.msg('isAnimation只能为0和1')
    classInfo.isAnimation = parseInt(isAnimation)
  }
  if (classTags !== '全部' && classTags) {
    if (typeof classTags !== 'string') return ctx.msg('数据非法')
    classInfo.classTags = {
      [Op.like]: `%${classTags ? classTags.replace(/[ ]|[\r\n]/g, '') : ''}%`
    }
  }

  if (!limit || !page || page <= 0 || limit > 40 || limit <= 0) return ctx.msg('page和limit不能为空 page不能小于0 limit不能大于40或小于0')
  // 传入的limit 和 page 必须是数字
  if (isNaN(parseInt(limit)) || isNaN(parseInt(page))) return ctx.msg('传入的limit 和 page 必须是数字')

  try {
    const { count, rows } = await NovelInfo.findAndCountAll({
      limit: parseInt(limit),
      offset: limit * (page - 1),
      where: classInfo,
      order: [
        ['updateTime', 'DESC']
      ]
    })

    if (!rows) return ctx.msg('当前分页轻小说为空')

    // 处理数据库返回的数据
    const newData = []
    rows.forEach(item => {
      const newItem = item.dataValues
      newItem.classTags = newItem.classTags.split(',')
      newItem.intro = newItem.intro.split('\n')
      newData.push(newItem)
    })

    ctx.msg('获取小说列表成功', 200, { list: newData, count })
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
