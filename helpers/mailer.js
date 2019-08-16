const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'yuvensenverd@gmail.com',
        pass : 'pkdzgjiedyoupjat'
    },
    tls: {
        rejectUnauthorized : false
    }
})

module.exports=transporter