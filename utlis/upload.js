const COS = require('cos-nodejs-sdk-v5');

// 创建实例
const cos = new COS({
  SecretId: '',
  SecretKey: '',
});

module.exports = cos
