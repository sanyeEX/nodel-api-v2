const User = require('../../model/User')
const redisClient = require('../../utlis/redis')
const { encrypt } = require('../../utlis/crypto')

module.exports = async (ctx) => {
  const { email, newPwd, emailCode } = ctx.request.body

  const emailCheck = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
  const pwdCheck = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/;

  if (!email || !newPwd || !emailCode) return ctx.msg('邮箱,密码,验证码都不能为空')
  if (!emailCheck.test(email)) return ctx.msg('邮箱不合法')
  if (!pwdCheck.test(newPwd)) return ctx.msg('新密码必须包含(字母和数字),长度6-20位')

  try {
    // 查询数据库是否存在当前邮箱
    const userInfo = await User.findOne({
      where: {
        email
      }
    })

    if (!userInfo) return ctx.msg('当前邮箱不存在')
    // 获取redis验证码
    const code = await redisClient.get(email)
    if (!code) return ctx.msg('请获取验证码')

    if (parseInt(emailCode) !== parseInt(code)) return ctx.msg('验证码不正确请重新输入')

    // 更新数据库密码
    const encryptPwd = encrypt(newPwd) // 加密密码
    await User.update({
      password: encryptPwd
    }, {
      where: {
        email
      }
    })

    await redisClient.del(email) // 删除验证码

    ctx.msg('重置密码成功', 200, { username: userInfo.username })
  } catch (e) {
    ctx.msg('错误', 403, e)
  }


}
