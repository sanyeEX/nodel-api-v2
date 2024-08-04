const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'novel',
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4'
  },
  dialectOptions: {
    collate: 'utf8mb4_unicode_ci'
  }
})

// 测试连接
sequelize.authenticate().then(_=>{
  console.log("数据库连接成功!");
}).catch(err=>{
  console.log("数据库连接失败! ", err);
})

sequelize.sync();

module.exports = sequelize
