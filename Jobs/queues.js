const QueueMQ = require("bull")
const emailProcess = require("../Jobs/emailProcess");

const emailQueue = new QueueMQ("email",{
    redis: process.env.REDIS_PORT
});
emailQueue.on("completed", (job, result) => {
    console.log(`Job completed JOBID:- ${job.id}`);
  });

emailQueue.process(emailProcess);

const sendNewEmail = (data)=>{
    emailQueue.add(data,{
        attempt: 2,
    });
}

module.exports = {sendNewEmail,emailQueue};