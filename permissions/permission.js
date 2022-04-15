const ROLE = require('../roles/role-permissions');
const User = require('../models/user');
const Post = require('../models/post');


const roleChecker = async (role = "",req,res,next) =>{
    try{
        const{_id} = req.user;
        const user = await User.findOne({_id});
        if(!user.hasRole(role)) return res.status(401).json({success:false,error:"Not allowed"});
        req.isAdmin = role === "Admin";
        next();
    }catch(error){
        res.status(500).json({success:false, error:error})
    }
}


const permChecker = async (perm = "",req,res,next) =>{
    try{
        const{_id} = req.user;
        const user = await User.findOne({_id});
        if(!user.can(perm)) return res.status(401).json({success:false,error:"Not allowed"})
        req.hasPerm = user.can(perm);
        next();
    }catch(error){
        res.status(500).json({success:false, error:error})
    }
}


const setPost = async (req,res,next)=>{
    try{
        const{id:postId} = req.params;
        const post = await Post.findOne({_id:postId}).populate('postedBy');
        if(!post){
            res.status(500).json({success:false,msg:"Error: post not found!!! "}) 
        }
        req.post = post;
        next();
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}

const getUserPost = (user,post)=>{

    return post.postedBy === user._id
}




module.exports = {setPost,roleChecker,permChecker,getUserPost}