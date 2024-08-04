const Koa = require('koa');
const cors = require('@koa/cors')
const router = require('./router/index')
// const staticFiles = require('koa-static')
// const path = require('path')
const statusInfo = require('./utlis/statusInfo')
// const bodyParser = require('koa-bodyparser');
const { jwtConfig, jwtErrorInfo, errorInfo  } = require('./utlis/koa-jwt')
const { koaBody } = require('koa-body');

const app = new Koa();

// 注册路由
app.use(cors()) // 跨域
  .use(koaBody({
    multipart: true, // 启用文件上传支持
  }))
  // .use(staticFiles(path.join(__dirname, './public'))) // 开放静态文件
  // .use(bodyParser()) // 获取post请求内容
  .use(errorInfo) // 配置jwt 自定义 信息提示
  .use(jwtConfig) // 配置jwt权限校验
  .use(jwtErrorInfo) // 用户是否存在token
  .use(statusInfo) // 注册全局消息
  .use(router.routes()) // 注册路由
  .use(router.allowedMethods())

app.listen(3000, () => {
  console.log('http://localhost:3000')
});
