const express = require('express');
require('dotenv').config();
const connectDb = require('./Db/connectDb')
const app = express();
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const PostRoute = require('./routes/post');
const RoleRoute = require('./routes/roles');
const CommentRoute = require('./routes/comment');
const cors = require("cors")
app.use(cors())
const {emailQueue} = require("./Jobs/queues");
app.use(express.json());
app.use('/api/v1/auth',AuthRoute);
app.use('/api/v1/users',UserRoute);
app.use('/api/v1/posts',PostRoute);
app.use('/api/v1/roles',RoleRoute);
app.use('/api/v1/comment/post',CommentRoute);
app.use(cors());

const Queue = require('bull')
const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')



const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
 
  ],
  serverAdapter:serverAdapter
})

serverAdapter.setBasePath('/admin/queues')
app.use('/admin/queues', serverAdapter.getRouter());

const port = process.env.PORT || 5000
const start = ()=>{
  try{
     connectDb(process.env.MONGO_URI);
    app.listen(port,()=>{
        console.log(`server running on port: ${port}...`);
    })
  }catch(error){
        console.log(error)
  }
}
start();