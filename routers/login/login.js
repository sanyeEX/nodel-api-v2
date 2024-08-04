const User = require('../../model/User')
const jwt = require('jsonwebtoken')
const secret = 'my_app_secret'
const { decrypt } = require('../../utlis/crypto')

module.exports = async (ctx) => {
  const { username, password } = ctx.request.body

  if (!username || !password) return ctx.msg('用户名,密码不能为空')

  // 检验用户名密码邮箱
  const userCheck = /^[a-zA-Z0-9_-]{4,16}$/;
  const pwdCheck = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/;

  if (!userCheck.test(username)) return ctx.msg('用户名长度4到16位不包含中文')
  if (!pwdCheck.test(password)) return ctx.msg('密码必须包含(字母和数字),长度6-20位')

  // 查询用户名
  try {
    const userInfo = await User.findOne({
      where: {
        username
      }
    })

    // 查询用户是否被删除
    if (userInfo.dataValues.isDelete) return ctx.msg('用户已经被删除,请联系管理员进行恢复')
    // 判断是否存在当前用户名
    if (!userInfo) return ctx.msg('用户名不存在')

    // 查询密码是否匹配
    if (decrypt(userInfo.dataValues.password) !== password) return ctx.msg('密码不匹配')

    // 生成token
    const user = {...userInfo.dataValues, password: "", createdAt: "", updatedAt: ""}
    const token =  jwt.sign(user, secret, { expiresIn: '12h' })
    const tokenStr = `Bearer ${token}`
    ctx.msg('登录成功', 200, { token: tokenStr})
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
