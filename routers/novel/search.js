const NovelInfo = require("../../model/NovelInfo");
const { Op } = require("sequelize");

module.exports = async (ctx) => {

  const { name, limit, page } = ctx.query

  if (!limit || !page || !name || page <= 0 || limit > 40 || limit <= 0) return ctx.msg('page,limit,name不能为空 page不能小于0 limit不能大于40或小于0')
  // 传入的limit 和 page 必须是数字
  if (isNaN(parseInt(limit)) || isNaN(parseInt(page))) return ctx.msg('传入数据非法')

  const newName = name.replace(/\r\n/g, '')
  try {
    const { count, rows } = await NovelInfo.findAndCountAll({
      limit: parseInt(limit),
      offset: limit * (page - 1),
      where: {
        name: {
          [Op.like]: `%${newName}%`
        }
      },
    })

    // 处理数据库返回的数据
    const newData = []
    rows.forEach(item => {
      const newItem = item.dataValues
      newItem.classTags = newItem.classTags.split(',')
      newItem.intro = newItem.intro.split('\n')
      newData.push(newItem)
    })

    if (rows.length === 0) return ctx.msg('搜索结果为空')
    ctx.msg('获取轻小说成功', 200, { list: newData, count })
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
