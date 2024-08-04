const Comment = require('../../model/Comment')
const CommentReply = require('../../model/CommentReply')
const User = require('../../model/User')

module.exports = async (ctx) => {
  const { comment_id, limit, page } = ctx.query

  if (!comment_id || !limit || !page || page <= 0 || limit > 40 || limit <= 0) return ctx.msg('comment_id, limit, page都不能为空')

  try {
    const comment = await Comment.findOne({
      where: {
        id: parseInt(comment_id)
      }
    })
    if (!comment) return ctx.msg('父评论不存在')

    const { count, rows } = await CommentReply.findAndCountAll({
      limit: parseInt(limit),
      offset: limit * (page - 1),
      where: {
        comment_id: parseInt(comment_id)
      }
    })

    if (rows.length === 0) return ctx.msg('当前回复评论为空')

    const newReplyList = []
    for (const item of rows) {
      // 获取评论用户信息
      const user = await User.findOne({
        where: {
          id: item.dataValues.user_id
        }
      })

      item.dataValues.nickname = user.dataValues.nickname
      item.dataValues.picture = user.dataValues.picture

      newReplyList.push(item)
    }

    ctx.msg('获取回复评论成功', 200, newReplyList)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
