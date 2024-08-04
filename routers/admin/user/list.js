const User = require('../../../model/User')

module.exports = async (ctx) => {
  let { offset = 0, limit = 20 } = ctx.query

  if (offset < 0 || limit < 1 || limit > 100) return ctx.msg('offset不能小于0,limit不能小于1或者大于100')
  if (isNaN(offset) || isNaN(limit)) return ctx.msg('参数不合法')

  try {
    const { count, rows } = await User.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit)
    })

    const list = []

    rows.forEach(item => {
      item.dataValues.password = ""
      list.push(item)
    })

    ctx.msg('获取用户列表成功', 200, {
      count,
      list
    })
  } catch (e) {
    console.log(e)
  }
}
