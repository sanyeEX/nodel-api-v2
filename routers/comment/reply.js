const Comment = require('../../model/Comment')
const CommentReply = require('../../model/CommentReply')

module.exports = async (ctx) => {
  const { comment_id, content } = ctx.request.body
  const userId = ctx.state.user.id


  if (!userId) return ctx.msg('用户错误')
  if (!comment_id || !content) return ctx.msg('回复评论id和评论内容不能为空')

  try {
    const comment = await Comment.findOne({
      where:{
        id: parseInt(comment_id)
      }
    })
    if (!comment) return ctx.msg('回复评论不存在')

    const replyInfo = {
      user_id: userId,
      comment_id: comment_id,
      comment_content: content
    }

    // 创建回复评论
    await CommentReply.create(replyInfo)
    ctx.msg('回复评论成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
