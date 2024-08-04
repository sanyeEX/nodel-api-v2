const User = require('../../../model/User')
const { encrypt } = require('../../../utlis/crypto')
const cos = require('../../../utlis/upload')
const path = require("path");

module.exports = async (ctx) => {
  const { id, password, nickname, email, isAdmin, isDelete, isUpdatePic } = ctx.request.body

  if (!id) return ctx.msg('用户id不能为空')
  if (!nickname) return ctx.msg('用户昵称不能为空')
  if (!email) return ctx.msg('用户邮箱不能为空')
  if (isDelete === null) ctx.msg('是否更改为禁用不能为空')
  if (isAdmin === null) return ctx.msg('是否更改为管理员不能为空')
  if (isUpdatePic === null) return ctx.msg('是否上传图片不能为空')

  const pwdCheck = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/;
  const emailCheck = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;

  if (!emailCheck.test(email)) return ctx.msg('邮箱不合法')
  if (nickname.length > 20) return ctx.msg('昵称长度不能大于20')

  // 获取当前id的邮箱
  const currentEmail = await User.findOne({
    where: {
      id: parseInt(id)
    }
  })

  if (currentEmail.dataValues.email !== email) {
    // 查询更改邮箱是否已经存在
    const isEmail = await User.findOne({
      where: {
        email
      }
    })

    if (isEmail) return ctx.msg('邮箱已经存在')
  }

  if (isUpdatePic) {
    if (!ctx.request.files) return ctx.msg('请上传图片', 403)

    const file = ctx.request.files.picture

    if (!file.originalFilename) return ctx.msg('错误')

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
        picture: `https://${data.Location}`,
      }, {
        where: {
          id: parseInt(id)
        }
      })
    } catch (e) {
      console.log(['错误:', e])
    }
  }

  // 加密密码
  const encryptPwd = encrypt(password)

  // 判断是否需要修改密码
  if(password) {
    if (!pwdCheck.test(password)) return ctx.msg('密码必须包含(字母和数字),长度6-20位')

    try {
      await User.update({
        password: encryptPwd,
        nickname,
        email,
        isAdmin,
        isDelete
      }, {
        where: {
          id: parseInt(id)
        }
      })

      ctx.msg('用户信息更新成功', 200)
    } catch (e) {
      console.log(e)
    }
  } else {
    try {
      await User.update({
        nickname,
        email,
        isAdmin,
        isDelete
      }, {
        where: {
          id: parseInt(id)
        }
      })

      ctx.msg('用户信息更新成功', 200)
    } catch (e) {
      console.log(e)
    }
  }
}
