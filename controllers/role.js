const User = require('../models/user');
const roles = require('../roles/role-permissions');

const addRole = async (req,res)=>{
    try{
        const{id:userId} = req.params;
        const{roleName} = req.body;
        const user = await User.findOne({_id:userId});
        let userRole ="";
        roles.forEach(role=>{
            if(role.name === roleName){
                userRole = role;
            }
        })
        if(!user){
            res.status(500).json({success:false,msg:"User not found"})
        }
        const roleArray = Object.values(userRole);
        if(!roleArray.includes(roleName)){
            res.status(500).json({success:false,msg:"Role is not part of the accepted roles"})
        }
        await user.assignRole(userRole);
        res.status(200).json({success:"true", data:`${userRole} given to ${user.username}`});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}


const removeRole = async (req,res) =>{
    try{
        const{id:userId} = req.params;
        const user = await User.findOne({_id:userId});
        if(!user){
            res.status(500).json({success:false,msg:"User not found"})
        }
        const{role} = user;
        if(role.name === undefined){
            res.status(500).json({success:false,msg:"User does not have role"})
        }
        await user.revokeRole(role.name);
        // add default role to user
        
        res.status(200).json({success:"true", data:`${userRole} has been revoked`});      
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error})
    }
}

module.exports = {addRole,removeRole}