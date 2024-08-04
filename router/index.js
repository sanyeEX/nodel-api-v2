const Router = require('koa-router')

const router = new Router()

// 获取小说列表
router.get('/novelList', require('../routers/novel/list'))
// 获取小说基本信息
router.get('/novelInfo', require('../routers/novel/info'))
// 获取小说目录和章节
router.get('/novelRoll', require('../routers/novel/roll'))
// 获取小说章节内容
router.get('/chapterContent', require('../routers/novel/chapter_content'))
// 搜索小说
router.get('/novelSearch', require('../routers/novel/search'))

// 登录
router.post('/login', require('../routers/login/login'))
// 注册
router.post('/register', require('../routers/register/register'))
// 忘记密码
router.post('/forget', require('../routers/forget/forget'))
// 获取邮箱验证码
router.get('/getEmailCode', require('../routers/code/email_code'))

// 获取用户信息
router.get('/userInfo', require('../routers/user/info'))
// 上传用户头像
router.post('/uploadUserAvatar', require('../routers/upload/upload_images'))
// 用户信息更新
router.post('/updateUserInfo', require('../routers/user/update_info'))
// 修改用户密码
router.post('/changePwd', require('../routers/user/change_pwd'))
// 获取用户评论
router.get('/getUserComment', require('../routers/user/comment'))

// 添加收藏
router.get('/addCollect', require('../routers/collect/addition'))
// 取消收藏
router.get('/cancelCollect', require('../routers/collect/cancel'))
// 获取收藏列表
router.get('/getCollectList', require('../routers/collect/list'))

// 添加评论
router.post('/addComment', require('../routers/comment/addtion'))
// 回复评论
router.post('/replyComment', require('../routers/comment/reply'))
// 获取评论
router.get('/getComment', require('../routers/comment/list'))
// 获取回复评论
router.get('/getReplyComment', require('../routers/comment/reply_list'))
// 获取评论用户基本信息
// router.get('/commentUserInfo', require('../routers/user/basic_info'))
// // 父评论赞
// router.get('/praise', require('../routers/comment/praise'))

// 添加历史记录
router.get('/addHistory', require('../routers/history/addition'))
// 获取历史记录
router.get('/getHistory', require('../routers/history/list'))

// 管理员api

// 获取用户列表
router.get('/getUserList', require('../routers/admin/user/list'))
// 修改用户信息
router.post('/changeUserInfo', require('../routers/admin/user/change'))
// 删除用户
router.get('/deleteUser', require('../routers/admin/user/delete'))

module.exports = router
