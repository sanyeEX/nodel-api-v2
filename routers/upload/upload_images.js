// 引入模块
const path = require('path');
const User = require('../../model/User')
const cos = require('../../utlis/upload')

async function uploadImages(ctx) {
  if (!ctx.request.files.file) return ctx.msg('请上传图片', 403)

  const user_id = ctx.state.user.id
  if (!user_id) return ctx.msg('用户token不存在')

  const file = ctx.request.files.file

  // 获取文件扩展名
  const fileExt = path.extname(file.originalFilename);

  // 判断是否是规定图片格式
  const imgPathName = ['.jpg', '.jpeg', '.png', '.gif', '.bmp',]
  if (!imgPathName.some(item => fileExt === item)) return ctx.msg('仅支持.jpg .png .gif. bmp等图片格式', 403)

  if (file.size > 5242880) return ctx.msg('图片大小不能超过5MB', 403)

  // 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。 https://console.cloud.tencent.com/cos5/bucket
  const Bucket = 'sanye-1256143046';
  // 存储桶Region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/
  // 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
  const Region = 'ap-guangzhou';

  // 生成随机文件名
  const randomFileName = () => {
    // 生成一个随机的字符串，用于文件名
    const randomString = Math.random().toString(36).substring(2);
    // 获取当前时间戳，用于确保文件名的唯一性
    const timestamp = Date.now();
    // 组合随机字符串和时间戳生成文件名
    return randomString + '_' + timestamp;
  };


  try {
    const data = await cos.uploadFile({
      Bucket, /* 填入您自己的存储桶，必须字段 */
      Region,  /* 存储桶所在地域，例如 ap-beijing，必须字段 */
      Key: `${randomFileName()}${fileExt}`,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
      FilePath: file.filepath,                /* 必须 */
      SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
    })

    await User.update({
      picture: `https://${data.Location}`
    }, {
      where: {
        id: parseInt(user_id)
      }
    })

    ctx.msg('更新头像成功', 200, `https://${data.Location}`)
    console.log(data)
  } catch (e) {
    console.log('[错误: ]', e)
  }
}

module.exports = uploadImages
