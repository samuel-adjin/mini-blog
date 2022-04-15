const Comment = require("../models/comment");

const PostComment = async (req,res)=>{
    try{
        const comment = new Comment({
            name: req.body.name,
            comment: req.body.comment
        });
        comment.post = req.post._id;
        comment.postedBy = req.user._id;
        await comment.save();
        if(!comment){
            return res.status(500).json({success:false,msg:"Something went wrong... Comment not posted"});
        }
        await post.save();
        res.status(500).json({success:true,msg:"Comment added successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}


const editComment = async (req,res)=>{
    try{
        const{_id} = req.params;
        const comment = await Comment.findOneAndUpdate({_id});
        const UserComment = isUserComment(req.user,comment);
        if(!UserComment) return res.status(401).json({success:false,msg:"not allowed"});
        if(!comment){
            return res.status(500).json({success:false,msg:"Something went wrong... Comment not found"}); 
        }
        res.status(500).json({success:true,msg:"Comment edited successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}


const deleteComment = async (req,res)=>{
    try{
        const{_id} = req.params;
        const comment = await Comment.findOneAndDelete({_id});
        const UserComment = isUserComment(req.user,comment);
        if(!UserComment) return res.status(401).json({success:false,msg:"not allowed"});
        if(!comment){
            return res.status(500).json({success:false,msg:"Something went wrong... Comment not found"}); 
        }
        res.status(500).json({success:true,msg:"Comment deleted successfully"});

    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}


const isUserComment = (user,comment)=>{
    return user._id === comment.postedBy
}

module.exports = {PostComment,editComment,deleteComment};
