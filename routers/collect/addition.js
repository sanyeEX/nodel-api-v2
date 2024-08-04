const NovelInfo = require('../../model/NovelInfo')
const UserCollect = require('../../model/UserCollect')

module.exports = async (ctx) => {
  const novelId = parseInt(ctx.query.novel_id)
  const userId = parseInt(ctx.state.user.id)

  if (!novelId || !userId) return ctx.msg('收藏小说id不能为空')

  try {
    // 查询是否存在当前小说
    const novel = await NovelInfo.findOne({
      where: {
        id: novelId
      }
    })

    if (!novel) return ctx.msg('收藏小说不存在')

    // 获取数据库中是否存在用户收藏记录
    const user = await UserCollect.findOne({
      where: {
        user_id: userId
      }
    })

    // 获取当前小说的收藏量
    let collectCount = novel.collect

    // 判断数据库中用户是否有过收藏记录
    if (user) {
      const idList = JSON.parse(user.novel_id_list)
      if (idList.some(item => parseInt(item) === novelId)) return ctx.msg('收藏已存在')
      idList.push(novelId)

      // 进行收藏
      await UserCollect.update({ novel_id_list: JSON.stringify(idList) }, {
        where: {
          user_id: userId
        }
      })
      // 收藏成功增加收藏量
      await addCollectAmount()
      ctx.msg('收藏成功', 200)
    } else {
      // 进行收藏
      await UserCollect.create({
        user_id: userId,
        novel_id_list: JSON.stringify([ novelId ])
      })

      // 收藏成功增加收藏量
      await addCollectAmount()
      ctx.msg('收藏成功', 200)
    }

    // 收藏成功增加当前小说的收藏量
    async function addCollectAmount() {
      await NovelInfo.update({ collect: collectCount += 1 },{
        where: {
          id: novelId
        }
      });
    }
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
