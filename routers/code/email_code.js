const nodeMail = require('../../utlis/nodemailer')
const User = require('../../model/User')
const redisClient = require('../../utlis/redis')
const emailInfo = require('../../utlis/email')   //编辑邮件

module.exports = async (ctx) => {
  const { email } = ctx.query

  const emailCheck = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
  if (!email) return ctx.msg('邮箱不能为空')
  if (!emailCheck.test(email) || email === 'you41611@163.com') return ctx.msg('邮箱不合法')

  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') // 生成验证码

  try {
    const userInfo = await User.findOne({
      where: {
        email
      }
    })

    if (!userInfo) return ctx.msg('当前邮箱不存在')

    // 判断验证码是否还存在
    // const result = await redisClient.get(email)
    // const ttl = await redisClient.ttl(email)
    // if (result) return ctx.msg(`请勿重复发送验证码,请等待${ttl}秒,在重新发送！`)

    // 发送邮件
    await nodeMail.sendMail(emailInfo(email, userInfo.username, code))
    await redisClient.set(email, code)// 保存验证码
    await redisClient.expire(email, 60) // 设置验证码为60秒

    ctx.msg('邮箱验证码发送成功', 200)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
