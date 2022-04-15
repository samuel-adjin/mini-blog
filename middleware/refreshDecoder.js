const jwt = require('jsonwebtoken');



const decodeRefreshToken = async (req,res,next)=>{
    try{
        const refresh_token = req.headers['X-REFRESH-TOKEN'];
        if(!refresh_token || typeof refresh_token !== "string"){
            res.status(500).json("Invalid token");
        }
        const decoded = await jwt.verify(refresh_token,process.env.REFRESH_TOKEN)
        if(!decoded){
            res.status(500).json("Token is corrupted or expired");
        }
        const{email,_id,role,username} = decoded;
        req.user = {email,_id,role,username};
        next();
    }catch(error){
        res.status(500).json({error})
    }
}


module.exports = decodeRefreshToken;