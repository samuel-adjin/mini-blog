const res = require('express/lib/response');
const roles = require('../roles/role-permissions');


const addRoleToUser = async (roleName = "User",user )=>{
    try{
 
        let userRole ="";
        roles.forEach(role=>{
            if(role.name === roleName){
                userRole = role;
            }
        })
        const roleArray = Object.values(userRole);
        if(!roleArray.includes(roleName)){
           return res.status(500).json({success:false,msg:"Role is not part of the accepted roles"})
        }
        const role = await user.assignRole(userRole);
        return role;
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,error})
    }
}


module.exports = {addRoleToUser}