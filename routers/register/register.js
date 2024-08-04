const User = require('../../model/User')
const { encrypt } = require('../../utlis/crypto')

module.exports = async (ctx) => {
  const body = ctx.request.body
  let { username, password, email, nickname } = ctx.request.body

  // 清除空格和换行
  for (const key in body) {
    body[key] = body[key].replace(/\s+/g, '').replace(/[\r\n]/g, '')
  }

  if (!username || !password || !email) return ctx.msg('用户名,密码,邮箱都不能为空')
  if (!nickname) {
    nickname = '该用户未设置昵称'
  }

  // 检验用户名密码邮箱
  const userCheck = /^[a-zA-Z0-9]{4,16}$/;
  const pwdCheck = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/;
  const emailCheck = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;

  // 验证用户信息
  if (!userCheck.test(username)) return ctx.msg('用户名长度4到16位不包含中文和特殊字符')
  if (!pwdCheck.test(password)) return ctx.msg('密码必须包含(字母和数字),长度6-20位')
  if (!emailCheck.test(email)) return ctx.msg('邮箱不合法')
  if (nickname.length > 20) return ctx.msg('昵称长度不能大于20')

  try {
    // 查询用户名
    const user = await User.findOne({
      where: {
        username
      }
    })

    // 查询邮箱
    const emailInfo = await User.findOne({
      where: {
        email
      }
    })

    // 判断是否存在当前用户名和邮箱
    if (user) return ctx.msg('用户名已存在')
    if (emailInfo) return ctx.msg('邮箱已存在')

    // 加密密码
    const encryptPwd = encrypt(password)
    // 创建用户
    const createUser = await User.create({
      username,
      password: encryptPwd,
      nickname,
      picture: 'https://sanye-1256143046.cos.ap-guangzhou.myqcloud.com/jiabaili.jpg', // 默认注册头像
      email
    })

    const userInfo = { ...createUser.dataValues, password: '' }

    ctx.msg('注册成功', 200, userInfo)

  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
