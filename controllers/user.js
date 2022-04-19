const User = require('../models/user');
const jwt = require('jsonwebtoken');
const{getRedis,setRedis} = require("../Helpers/redis");
const {isUser} = require("../Helpers/user");
const Post = require("../models/post");
const {upload,deleteFile} = require("../Helpers/fileUpload");



const showAllUsers = async (req,res)=>{
    try{
    console.log(User);
    const redisData = await getRedis("users");
    if(redisData != null) return res.status(200).json({success:true,data:redisData})
    const users = await User.find({});
    await setRedis("users",users);
    res.status(200).json({success:true,data:users});
    }catch(error){
        res.status(500).json({success:false,error}); 
    } 
}

const getUser = async (req,res)=>{
    try{
        const {id:userId} = req.params;
        const redisData = await getRedis(`userId:${userId}`);
        if(redisData != null) return res.status(200).json({success:true,data:redisData})
        const user = await User.findOne({_id:userId}).populate('posts');
        if(!user){
            res.status(500).json({success:false,msg:'Ooops can not find user'});   
        }
        await setRedis(`userId:${userId}`,users);
        res.status(200).json({success:true,data:user});
    }catch(error){
        res.status(500).json({success:false,error}); 
    }
}


const updateUser = async (req,res)=>{
    try{

        const {id:userId} = req.params;
        const userAccount = isUser(req.user,userId);
        if(!userAccount)  return res.status(401).json({ success: false, error: "Not allowed" });
        const user = await User.findOneAndUpdate({_id:userId},req.body,{
            new:true,
            runValidators:true
        });
        if(!user){
            res.status(500).json({success:false,msg:'Ooops can not find user... Record not updated'});   
        }
        res.status(200).json({success:true,data:user});
    }catch(error){
        res.status(500).json({success:false,error}); 
    }
}

const deleteUser = async (req,res)=>{
    try{
        const {id:userId} = req.params;
        const user = await User.findOneAndDelete({_id:userId});
        if(!user){
            res.status(500).json({success:false,msg:'Ooops... user not deleted!!! Can not find user'});    
        }
        res.status(200).json({success:true,msg:`${user.username} deleted successfully`});
    }catch(error){
        res.status(500).json({success:false,error});   
    }
}


const searchUser = async (req,res)=>{
    try{
        const{first_name,last_name,middle_name,username,email} = req.query;
        const searchObj = {};
        if(first_name){
            searchObj.firstName = first_name;
        }
        if(last_name){
            searchObj.lastName = last_name;
        }
        if(middle_name){
            searchObj.middleName = middle_name;
        }
        if(username){
            searchObj.username = username;
        }
        if(email){
            searchObj.email = email;
        }
        const arrayKeys = object.keys(searchObj);
        const key = arrayKeys.join('-');
        const redisData = await getRedis(`search:${key}`);
        if(redisData != null) return res.status(200).json({success:true,data:redisData})
        const users = await User.find(searchObj).populate('posts');
        await setRedis(`search:${key}`,users);
        res.status(200).json({success:true,data:users});
    }catch(error){
        res.status(500).json({success:false,error}); 
    }
}


const allUserPost = async (req,res) =>{
    try{
        const{id:userId} = req.params;
        const user = await User.findOne({_id:userId});
        // res.json(user)
        if(!user){
            res.status(500).json({success:false,msg:'Ooops can not find user...'});   
        }
    
       const userPost = await Post.getAllUserPost(userId);
       console.log(user._id);
       res.json(userPost);
    }catch(error){
        console.log(error)
        res.status(500).json({success:false,error}); 
    }
}

const token = async (req,res) =>{
   
    try{
       const user = await User.findOne({_id:req.user._id});
        if(!user){
            res.status(500).json({error:"Invalid user"});
        }
        const{_id,role,username} =user;
        const userData = {_id,role,username}
        const access_token = await generateToken(userData);
        const refresh_token = await generateRefreshToken(userData);
        res.status(200).json({success:"true", data:{access_token,refresh_token}}); 
    }catch(error){
        res.status(500).json({error:error})
    }
}


const lockAccount = async (req,res)=>{
    try{
        const{id:userId} = req.params;
        const user  = await User.findOne({_id:userId});
        if(!user){
            res.status(500).json({success:false,msg:'Ooops... user not deleted!!! Can not find user'});    
        }
        user.isLocked = true;
        await user.save();
        res.status(200).json({success:"true", msg:"Account has been locked success"});
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, error:error})
    }
}

const unLockAccount = async (req,res)=>{
    try{
        const{id:userId} = req.params;
        const user  = await User.findOne({_id:userId});
        if(!user){
            res.status(500).json({success:false,msg:'Ooops... user not deleted!!! Can not find user'});    
        }
        user.isLocked = false;
        await user.save();
        res.status(200).json({success:"true", msg:"Account has been unlocked successfully"});
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, error:error})
    }
}


const uploadProfilePic = async (req,res)=>{
    try{
        const image = upload.single('profile');
          image(req,res, async (err)=>{
            if(err){
                throw err 
            }
            if(req.file === undefined){
                res.status(500).json({success:false,msg: "no file selected"})
            }else{
                const user = await User.findOne({_id:req.user._id});
                if(!user){
                    res.status(500).json({success:false,msg:'Ooops... user not found!!! Session expired'});   
                }
                if( user.profilePic !== null){
                    deleteFile(user.profilePic)
                    user.profilePic = req.file.path;
                    user.save();
                    res.status(201).json({success:"true", msg:"Profile pic changed successfully"});
                }
                user.profilePic = req.file.path;
                user.save();
                res.status(201).json({success:"true", msg:"Profile pic added successfully"});
            }
        })
    }catch(error){
        res.status(500).json({success:false, error:error})
    }
}


const deleteProfilePic = async (req,res)=>{
    try{
        const user = await User.findOne({_id:req.user._id});
        if(!user){
            res.status(500).json({success:false,msg:'Ooops... user not found!!! Profile pic not removed'});   
        }
        deleteFile(user.profilePic)
        user.profilePic = null;
        res.status(200).json({success:"true", msg:"Profile pic removed successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false, error:error}) 
    }
}

const generateToken = (userData) =>{
    const token =  jwt.sign(userData,process.env.ACCESS_TOKEN,{expiresIn:'30s'})
    return token;
}

const generateRefreshToken = (userData) =>{
    const token =  jwt.sign(userData,process.env.REFRESH_TOKEN,{expiresIn:'10d'})
    return token;
}

module.exports = {showAllUsers,getUser,updateUser,deleteUser,searchUser,token,lockAccount,unLockAccount,allUserPost,deleteProfilePic,uploadProfilePic}
