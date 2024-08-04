const NovelInfo = require('../../model/NovelInfo')
const Comment = require('../../model/Comment')

module.exports = async (ctx) => {
  const { novel_id, content } = ctx.request.body
  const userId = ctx.state.user.id

  if (!userId) return ctx.msg('用户错误')
  if (!novel_id ||!content) return ctx.msg('评论内容和小说id不能为空')

  try {
    const novel = await NovelInfo.findOne({
      where: {
        id: novel_id
      }
    })
    if (!novel) return ctx.msg('当前小说不存在无法进行评论')

    // 保存评论信息
    const commentInfo = {
      user_id: userId,
      novel_id: novel_id,
      comment_content: content
    }

    // 创建评论
    await Comment.create(commentInfo)
    ctx.msg('评论成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
