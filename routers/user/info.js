const User = require('../../model/User')

module.exports = async (ctx) => {
  const userId = ctx.state.user.id

  if (!userId) return ctx.msg('用户token不存在')

  try {
    // 查询数据库用户信息
    const user = await User.findOne({
      where: {
        id: parseInt(userId)
      }
    })


    if (!user) return ctx.msg('用户不存在')

    // 用户信息
    const userInfo = {
      id: user.id ? user.id : '',
      username: user.username ? user.username : '',
      nickname: user.nickname ? user.nickname : '',
      picture: user.picture ? user.picture : '',
      email: user.email ? user.email : '',
    }
    ctx.msg('获取用户信息成功', 200, userInfo)

  } catch (e) {
    ctx.msg('错误', 403, e)
  }


}
