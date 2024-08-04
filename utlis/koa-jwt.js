const secret = 'my_app_secret'
const jwt = require('koa-jwt');

// 无需校验权限的路由
const path = [
  '/login',
  '/register',
  '/forget',
  '/getEmailCode',
  '/novelList',
  '/novelInfo',
  '/novelRoll',
  '/chapterContent',
  '/novelSearch',
  '/getComment',
  '/getReplyComment',
  '/commentUserInfo'
]

// 用户权限校验路由
const userPath = [
  '/userInfo',
  '/uploadUserAvatar',
  '/updateUserInfo',
  '/changePwd',
  '/addCollect',
  '/cancelCollect',
  '/getCollectList',
  '/addComment',
  '/replyComment',
  '/addHistory',
  '/getHistory',
  '/getUserComment'
]

// 管理员校验的路由
const adminPath = [
  '/getUserList',
  '/changeUserInfo',
  '/deleteUser'
]

module.exports = {
  // 校验配置信息
  jwtConfig: jwt({secret, algorithms: ["HS256"]}).unless({ path }),
  // token错误返回
  async jwtErrorInfo(ctx, next) {
    // 获取当前路由链接
    const url = ctx.request.url.split('?')[0]

    // 判断是否存在用户信息
    if (!ctx.state.user) return next()

    // 判断是否是管理员可以访问的链接
    const isAdminPath = adminPath.some(item => item === url)
    // 判断是否是用户可以访问的链接
    const isUserPath = userPath.some(item => item === url)

    if (ctx.state.user.isDelete) return ctx.body = {
      status: 403,
      message: '用户已经被删除,请联系管理员进行恢复'
    }

    // 判断是否是管理员操作
    if (ctx.state.user.isAdmin) {
      if (isUserPath) return next()
      if (isAdminPath) return next()
      ctx.body = {
        status: 403,
        message: '无管理员权限'
      }
    } else {
      if (isAdminPath) {
        return ctx.body = {
          status: 403,
          message: '无管理员权限'
        }
      }
      if (isUserPath) {
        return next()
      } else {
        ctx.body = {
          status: 403,
          message: '无用户权限'
        }
      }
    }
  },
  async errorInfo(ctx, next) {
    return next().catch((err) => {
      if(err.status === 401){
        ctx.status = 200;
        ctx.body = {
          status: 401,
          message: "token无权限"
        };
      } else {
        console.log(err)
      }
    })
  },
  secret
}
