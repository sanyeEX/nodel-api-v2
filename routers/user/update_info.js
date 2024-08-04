const User = require('../../model/User')

module.exports = async (ctx) => {
  const newUserInfo = ctx.request.body
  if (!newUserInfo.nickname) return ctx.msg('用户昵称不能为空')

  const userId = parseInt(ctx.state.user.id)
  if (!userId) return ctx.msg('用户错误')

  try {
    const userInfo = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!userInfo) return ctx.msg('用户不存在')
    if (userInfo.nickname === newUserInfo.nickname) return ctx.msg('修改的昵称不能和历史昵称一致')

    await User.update({ nickname: newUserInfo.nickname }, {
      where: {
        id: userId
      }
    })

    ctx.msg('更新用户信息成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }



}
