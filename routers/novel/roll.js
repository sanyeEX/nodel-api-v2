const NovelRoll = require('../../model/NovelRoll')
const NovelInfo = require('../../model/NovelInfo')
const NovelChapter = require("../../model/NovelChapter");

module.exports = async (ctx) => {
  const id = parseInt(ctx.query.novel_id)

  if (!id) return ctx.msg('id不能为空')

  try {
    // 获取目录
    const roll = await NovelRoll.findAll({
      where: {
        novel_id: id
      }
    })

    if (roll.length === 0) return ctx.msg('小说目录为空')

    const rollArr = []
    for (let item of roll) {
      // 获取章节
      item.dataValues.chapter_list = await NovelChapter.findAll({
        where: {
          roll_id: item.dataValues.id
        }
      })
      rollArr.push(item)
    }

    // 获取分类名称
    const info = await NovelInfo.findOne({
      where: {
        id
      }
    })
    if (roll.length === 0) return ctx.msg('获取当前卷目录为空')
    ctx.msg('获取卷目录成功', 200, { className: info.className , result: rollArr})
  } catch (e) {
    ctx.msg('错误', 403, e)
  }
}
