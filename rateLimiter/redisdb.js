import {createClient} from "redis";
function connectRedisDB(){

    const redisClient = createClient();
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.connect()
    return redisClient
}

export default connectRedisDB;