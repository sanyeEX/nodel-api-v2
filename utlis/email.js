module.exports = function (email, username, code) {
  return {
    from:  `"次元轻小说"<you41611@163.com>`,// 发件人
    subject: '次元轻小说-密码找回',//邮箱主题
    to: email,//收件人，这里由post请求传递过来
    // 邮件内容，用html格式编写
    html: `
      <div>
        <h3 style="font-weight: normal"><a href="http://novel.sanyeex.top" style="text-decoration: none;">次元轻小说</a></h3>
        <p>用户 <span style="color: red">${username}</span> 您正在找回密码</p>
        <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
        <p>如果不是您本人操作，请无视此邮件</p>
      </div>
    `
  }
}
