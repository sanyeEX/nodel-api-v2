const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient()

// 监听错误信息
redisClient.on('err', err => {
  console.log('redis client error: ', err)
})

redisClient.connect(6379, '127.0.0.1')

module.exports = redisClient
