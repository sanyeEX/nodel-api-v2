const User = require('../../model/User')
const { encrypt, decrypt } = require('../../utlis/crypto')

module.exports = async (ctx) => {
  const { historyPwd, password } = ctx.request.body

  const userId = parseInt(ctx.state.user.id)

  if (!historyPwd || !password || !userId) return ctx.msg('请输入旧密码和新密码')

  const pwdCheck = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/;
  if (!pwdCheck.test(password) || !pwdCheck.test(historyPwd)) return ctx.msg('密码必须包含(字母和数字),长度6-20位')

  try {
    const userPwd = await User.findOne({
      where: {
        id: userId
      }
    })

    if (!userPwd) return ctx.msg('当前用户不存在')

    const decryptPwd = decrypt(userPwd.password) // 解密密码 判断是否和历史密码相同

    if (historyPwd !== decryptPwd) return ctx.msg('历史密码不正确')
    if (password === decryptPwd) return ctx.msg('不能和历史密码相同')

    // 更新数据库密码
    const encryptPwd = encrypt(password) // 加密密码
    await User.update(
      {
        password: encryptPwd
      }, {
      where: {
        id: userId
      }
    })

    ctx.msg('修改密码成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
