const User = require('../../model/User')

module.exports = async (req, res) => {
  const userId = req.query.user_id

  if (!userId) return res.msg('id不能为空')

  // 查询数据库用户信息
  const user = await User.findOne({
    where: {
      id: parseInt(userId)
    }
  }).catch(err => err)
  if (user instanceof Error) return res.msg('修改失败', 404, user.name)
  if (!user) return res.msg('获取用户信息失败')
  // 用户信息
  const userInfo = {
    nickname: user.nickname ? user.nickname : '',
    picture: user.picture ? user.picture : '',
  }
  res.msg('获取基本用户信息成功', 200, userInfo)
}
