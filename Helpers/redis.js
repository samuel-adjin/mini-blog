const redis = require("redis")

const getRedis = async (key) =>{
    await redisConnection();
    const data = await redisClient.get(key);
    if(data != null){
        console.log("cache hit")
        console.log(data)
        return JSON.parse(data);
    }
}

const setRedis = async (key,value,exp = 30) =>{
    await redisConnection();
    redisClient.setEx(key,exp,JSON.stringify(value));
}

const getKeyRedis = async (appendValue,token) =>{
    await redisConnection();
    const key = appendValue +"-"+ token;
    const data = await redisClient.get(key);
    if(data != null){
        console.log("cache hit")
       const value = data
        await redisDeleteKey(key)
        return value;
    }

    
}


const setKeyRedis = async (key,value,exp = 30) =>{
    await redisConnection();
    redisClient.setEx(key,exp,value);   
}

const redisConnection = async ()=>{
    redisClient = redis.createClient(6379);
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
}

const redisDeleteKey = async (key)=>{
    await redisClient.del(key);
}

module.exports = {getRedis,setRedis,getKeyRedis,setKeyRedis}