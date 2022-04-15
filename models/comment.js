const {model,Schema} = require('mongoose');

const CommentSchema = new Schema({
    name:
    {
        type:String,
    },
    comment:
    {
        type:String,
        required:true,
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post",
    },
},{timestamps:true});

module.exports = model('Comment',CommentSchema);