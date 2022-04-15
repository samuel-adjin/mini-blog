const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');



const emailConfirmation = async  (msg)=>{
    const transport = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );
       await  transport.sendMail(msg);
}

const emailData = (from, email, subject,html) =>{
    const msg ={
        from: from,
        to: email,
        subject: subject,
        html: html
    };
    return msg;
}





module.exports = {emailConfirmation,emailData}