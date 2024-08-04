const User = require("../../../model/User");
module.exports = async (ctx) => {
  const { userId } = ctx.query

  if (!userId) return ctx.msg('用户id不能为空')

  try {
    await User.update({
      isDelete: true
    }, {
      where: {
        id: parseInt(userId)
      }
    })
    ctx.msg('删除用户成功', 200)
  } catch (e) {
    console.log('[错误]: ', e)
  }
}
