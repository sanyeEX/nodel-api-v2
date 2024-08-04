const UserHistory = require('../../model/UserHistory')
const NovelInfo = require('../../model/NovelInfo')

module.exports = async (ctx) => {
  const novelId = parseInt(ctx.query.novel_id)
  const userId = parseInt(ctx.state.user.id)

  if (!novelId || !userId) return ctx.msg('历史小说id不能为空')

  try {
    // 查询是否存在当前小说
    const novel = await NovelInfo.findOne({
      where: {
        id: novelId
      }
    })

    if (!novel) return ctx.msg('历史小说不存在')

    // 获取数据库中是否存在用户历史记录
    const user = await UserHistory.findOne({
      where: {
        user_id: userId
      }
    })

    // 判断数据库中用户是否有过历史记录
    if (user) {
      const idList = JSON.parse(user.novel_id_list)
      if (idList.some(item => parseInt(item) === novelId)) return ctx.msg('历史已存在', 200)
      idList.push(novelId)

      // 进行添加历史记录
      await UserHistory.update({ novel_id_list: JSON.stringify(idList) }, {
        where: {
          user_id: userId
        }
      })
      ctx.msg('追加历史记录成功', 200)
    } else {
      // 进行收藏
      await UserHistory.create({
        user_id: userId,
        novel_id_list: JSON.stringify([ novelId ])
      })
      ctx.msg('追加历史记录成功', 200)
    }
  } catch (e) {
    ctx.msg('错误', 403, e)
    console.log(e);
  }
}
