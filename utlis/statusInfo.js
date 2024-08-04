module.exports = async (ctx, next) => {
  ctx.msg = (message, status = 403, data) => {
    ctx.status = 200
    return ctx.body = JSON.stringify({
      status, // 错误代码
      message: message instanceof Error ? message.message : message, // 是否错误信息
      data
    })
  }
  await next()
}
