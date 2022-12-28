import {MongoClient} from "mongodb";

async function performMongoDbOperation(db_uri = "mongodb://localhost:27017/", cb , params){
    const client = new MongoClient(db_uri);

    try {
        await client.connect();
        cb(params,client);
        console.log("Connected successfully to server");
    } catch (error) {
        console.error(error)
    }
}

export default performMongoDbOperation;