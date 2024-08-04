const svgCaptcha = require('svg-captcha')

module.exports = (req, res) => {
  let captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: "0oOiIl1", // 验证码字符中排除某些字符
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    height: 35
  })
  
  res.msg('获取验证码成功', 200, captcha.data)
}