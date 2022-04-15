const jwt = require('jsonwebtoken');



const verifyToken = async (req,res,next)=>{
    try{
       
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ') || typeof authHeader !== "string"){
            res.status(500).json("Invalid token");
        }
        const access_token = authHeader.split(' ')[1];
        const decoded = await jwt.verify(access_token,process.env.ACCESS_TOKEN)
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



module.exports = verifyToken;