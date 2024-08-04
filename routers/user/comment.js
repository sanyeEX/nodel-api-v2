const Comment = require('../../model/Comment')
const CommentReply = require('../../model/CommentReply')

module.exports = async (ctx) => {
  const userId = parseInt(ctx.state.user.id)

  if (!userId) return ctx.msg('用户token错误')

  try {
    const comment = await Comment.findAll({
      where: {
        user_id: userId
      }
    })
    const comment_reply = await CommentReply.findAll({
      where: {
        user_id: userId
      }
    })

    const commentArr = []
    comment.forEach(item => {
      item.dataValues.isReply = false
      commentArr.push(item.dataValues)
    })
    comment_reply.forEach(item => {
      item.dataValues.isReply = true
      commentArr.push(item.dataValues)
    })

    ctx.msg('获取用户评论成功', 200, commentArr)
  } catch (e) {
    console.log(e)
  }
}
