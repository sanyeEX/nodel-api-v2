const UserCollect = require('../../model/UserCollect')
const NovelInfo = require("../../model/NovelInfo");

module.exports = async (ctx) => {
  const novelId = parseInt(ctx.query.novel_id)

  const userId = parseInt(ctx.state.user.id)
  if (!novelId) return ctx.msg('取消收藏小说id不能为空')

  try {
    // 查询用户是否存在收藏记录
    const collect = await UserCollect.findOne({
      where: {
        user_id: userId
      }
    })
    if (!collect) return ctx.msg('用户收藏不存在')

    // 查询数据库中是否存在当前取消的小说
    const novel = await NovelInfo.findOne({
      where: {
        id: novelId
      }
    })

    if (!novel) return ctx.msg('取消收藏小说不存在')

    const newCollect = JSON.parse(collect.novel_id_list)
    // 判断用户收藏数据库中是否存在当前取消的小说
    const isCollect = newCollect.some((item, index) => {
      if (novelId === parseInt(item)) {
        newCollect.splice(index, 1)
      }
      return novelId === parseInt(item);
    })

    const list = JSON.stringify(newCollect)

    if (!isCollect) return ctx.msg('当前用户收藏列表不存在此小说')
    await UserCollect.update(
      {
        novel_id_list: list
      }, {
        where: {
          user_id: userId
        }
      })

    // 获取当前小说的收藏量
    let collectCount = novel.collect
    // 取消收藏成功减轻当前小说的收藏量
    await NovelInfo.update({ collect: collectCount - 1 },{
      where: {
        id: novelId
      }
    });

    ctx.msg('取消收藏成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
