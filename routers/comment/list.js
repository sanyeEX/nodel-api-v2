const NovelInfo = require('../../model/NovelInfo')
const Comment = require('../../model/Comment')
const CommentReply = require('../../model/CommentReply')
const User = require('../../model/User')

module.exports = async (ctx) => {
  const { novel_id, limit, page } = ctx.query

  if (!novel_id || !limit || !page || page <= 0 || limit > 40 || limit <= 0) return ctx.msg('novel_id, limit, page都不能为空')

  try {
    const novel = await NovelInfo.findOne({
      where: {
        id: parseInt(novel_id)
      }
    })
    if (!novel) return ctx.msg('小说不存在')

    const { count, rows } = await Comment.findAndCountAll({
      limit: parseInt(limit),
      offset: limit * (page - 1),
      where: {
        novel_id: parseInt(novel_id)
      }
    })
    // 查询每条父评论是否存在子子评论
    const newRows = []
    for (const item of rows) {
      const { count } = await CommentReply.findAndCountAll({
        where: {
          comment_id: parseInt(item.dataValues.id)
        }
      })

      // 获取评论用户信息
      const user = await User.findOne({
        where: {
          id: item.dataValues.user_id
        }
      })

      item.dataValues.nickname = user.dataValues.nickname
      item.dataValues.picture = user.dataValues.picture

      const newObj = {...item.dataValues, ...{ reply_count: count }}
      newRows.push(newObj)
    }

    if (!rows) return ctx.msg('当前小说评论为空')

    ctx.msg('获取评论成功', 200, { count, list: newRows })
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
