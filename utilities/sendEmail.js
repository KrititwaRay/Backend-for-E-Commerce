const nodemailer=require('nodemailer');

const sendMail=async(options)=>{
    

    const transporter = nodemailer.createTransport({
        service:process.env.SMTP_SERVICE ,//gmail
        host: "smtp.gmail.com",
        port: 465,
        // secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
    
    const mailOptions={
        from: process.env.SMTP_MAIL, // sender address
        to:options.email , // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
      
    }
   await transporter.sendMail(mailOptions)
}


module.exports=sendMail;