const{model,Schema} = require('mongoose');
const permissions = require('mongoose-permissions');
const Post = require("../models/post");



// add default role when creating user
const UserSchema = new Schema({
    email:
    {
        type: String,
        required:true,
        unique:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        trim:true,
    },
    password:
    {
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    middleName:{
        type:String,
        default:null,
        trim:true,
        lowercase:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true 
    },
    profilePic:{
        type:String,
        default:null
    },
    mobile:
    {
        type:String,
        required:true,
        trim:true
    },

    isVerified:{
        type:Boolean,
        default:false
    },
 
    isLocked:{
        type:Boolean,
        default:false
    },
 
    lastLogin:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true}).plugin(permissions);

// UserSchema.methods.getUserPost = function(){
//     return Post.where({postedBy:this._id})
// }


module.exports = model('User',UserSchema);