import performMongoDbOperation from "./mongo";
import connectRedisDB from "./redisdb";
import Err from "../Response/BasicErrorResponse"
import Res from "../Response/BasicResponse"

async function rateLimiterBase(expiryTime,totalNoOfRequests,req,res){
    const ip = req.header('x-forwarded-for') || req.ip;
    console.log(ip);
    const redisClient = connectRedisDB(); //connect with redis
    let requests = await redisClient.incr(ip)
    console.log(requests);
    const result = await rateLimit(expiryTime,redisClient,requests,totalNoOfRequests,ip)
    return res.json(result)
}


//Function to store rate limited requests in mongodb //
async function storeRateLimitedRequests 
    ({
        redisKey,
        ttl,
        noOfRequests,
        db_name
    },
        client
    ){ 
    //redis key = ip 
    //db_name = rate_limiter
    const db = client.db(db_name)
    const collection = db.collection("rate_limited_requests");
    const doc = {
        ip : redisKey,
        ttl : ttl,
        number_of_requests:noOfRequests
    }
    const result = await collection.insertOne(doc);
    console.log("Inserted --",result);
    return result

}


async function rateLimit(
    expirySeconds,
    redisClient,
    noOfRequests,
    limitRequests,
    redisKey
    ){
    try {
        let value = await redisClient.get(redisKey)
        if(!value){
            const err = new Err("Redis Key Does not Exist",{},404,true);
            return err.getValues
        }
        if(noOfRequests === 1) {
            await redisClient.expire(redisKey,expirySeconds) //expire ip 
        }
        let ttl = await redisClient.ttl(redisKey) //get the timeleft of the ip
        console.log(ttl,"TTl is");
       
        if(noOfRequests>limitRequests){
            const err = new Err("Too many frequent requests wait for sometime",{'requests':noOfRequests,'ttl':ttl},503,true);
            const db_name = "rate_limiter"; //mongodb name (should be from env)
            //uri = mongodb://localhost:27017 (should be from env)
            
            performMongoDbOperation("mongodb://localhost:27017/",storeRateLimitedRequests,{redisKey,ttl,noOfRequests,db_name})//store rate limited requests in mongodb
            return err.getValues
        }else{
            const res = new Res({'requests':noOfRequests,'ttl':ttl},200,"Toal Requests are " ,false)
            return res.getValues
        }
    } catch (error) {
        console.error(error);
        const err = new Err(error.toString(),{},500,true);
        return err.getValues
    }
}



export default rateLimiterBase