const nodemailer = require('nodemailer')

const nodeMail = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: 'you41611@163.com',
    pass: 'UOWJVTKYXTHKNYQA'
  }
})

module.exports = nodeMail