const {model,Schema} = require('mongoose');


const PostSchema = new Schema({
    title:
    {
        type:String,
        required:true
    },
    content:
    {
        type:String,
        required:true,
    },
    postedBy:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    image:[String],
},{timestamps:true});
PostSchema.statics.getAllUserPost = function(userId){
    return this.where({postedBy:userId});
}

module.exports = model('Post',PostSchema);