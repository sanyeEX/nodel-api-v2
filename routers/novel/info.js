const NovelInfo = require('../../model/NovelInfo')

module.exports = async (ctx) => {
  const id = ctx.query.novel_id

  if (!id) return ctx.msg('id不能为空')

  try {
    const novelInfos = await NovelInfo.findOne({
      where: {
        id: parseInt(id)
      }
    }).catch(err => err)
    if (!novelInfos) return ctx.msg('获取当前小说为空')

    // 处理数据库返回的数据
    novelInfos.classTags = novelInfos.classTags.split(',')
    novelInfos.intro = novelInfos.intro.split('\n')

    ctx.msg('获取小说信息成功', 200, novelInfos)
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
