const UserCollect = require('../../model/UserCollect')
const NovelInfo = require('../../model/NovelInfo')

module.exports = async (ctx) => {
  const userId = parseInt(ctx.state.user.id)

  const { limit, page } = ctx.query

  if (!userId) return ctx.msg('用户错误')
  if (!limit || !page || page <= 0 || limit > 40 || limit <= 0) return ctx.msg('page和limit不能为空 page不能小于0 limit不能大于40或小于0')

  try {
    // 获取是否有收藏小说
    const collect = await UserCollect.findOne({
      where: {
        user_id: userId
      }
    })
    if (!collect) return ctx.msg('收藏列表为空', 204, [])

    const novelIds = JSON.parse(collect.novel_id_list)
    const newNovelIds = []
    novelIds.forEach(item => {
      newNovelIds.push(parseInt(item))
    })

    // 查询收藏的小说基本信息
    const { count, rows } = await NovelInfo.findAndCountAll({
      limit: parseInt(limit),
      offset: limit * (page - 1),
      where: {
        id: newNovelIds
      }
    })

    if (rows.length === 0) return ctx.msg('收藏为空')

    // 处理数据库返回的数据
    const newData = []
    rows.forEach(item => {
      const newItem = item.dataValues
      newItem.classTags = newItem.classTags.split(',')
      newItem.intro = newItem.intro.split('\n')
      newData.push(newItem)
    })

    ctx.msg('获取收藏成功', 200, { list: newData, count, collectIds: newNovelIds })
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
