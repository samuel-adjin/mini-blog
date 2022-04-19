const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const emailProcess = async (job,done) => {
    try {
        const transport = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: process.env.SENDGRID_API_KEY
            })
        );
        await transport.sendMail({
            from:process.env.EMAIL_ADDRESS,
            to: job.data.email,
            subject: job.data.subject,
            html: job.data.html
        });
        done();
    } catch (error) {
        console.log(error);
    }
}

module.exports = emailProcess;