const ChapterContent = require("../../model/NovelChapterContent");

module.exports = async (ctx) => {
  const chapter_id = ctx.query.chapter_id

  if (!chapter_id) return ctx.msg('章节id不能为空')

  const content = await ChapterContent.findOne({
    where: {
      chapter_id
    },
  })

  if (!content) return ctx.msg('获取当前章节内容为空')
  const newData = content.dataValues
  // 处理数据返回的字符串数据
  newData.content = newData.content === '' ? [] : JSON.parse(newData.content)
  newData.pic_content = newData.pic_content === '' ? [] : JSON.parse(newData.pic_content)
  ctx.msg('获取章节成功', 200, content)
}
