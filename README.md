# rate-limiter

Dependencies -> 

    Node.js
    Express.js
    MongoDB (Storing the rate limited requests for future debugging)
    Redis (Used for rate limiting , Storing the key and managing the expity and ttl)

Guide to Run the project -> 

    Clone the Repository
    Run npm install 
    open postman and hit http://localhost:3000/api1 , 
    Payload is ->
    {
        "expiryTime":60,
        "totalNoOfRequests":20
    }
   [ Working Video Reference of the Api](  https://drive.google.com/file/d/1TkEsZaBWAO2H5vgeWxDYkKvRLm4c3eU3/view?usp=sharing)

    Response format is -> 
    

    Error Format
        
        {
            "error": true,
            "status": 503,
            "data": {
                "requests": 23, (No of requests hit till)
                "ttl": 26 (time left for the new successfull request to be made)
            },
            "message": "Too many frequent requests wait for sometime"
        }
        
    Success Format 
        {
            "error": false,
            "status": 200,
            "data": {
                "requests": 1,
                "ttl": 60
            },
            "message": "Toal Requests are "
        }

Functionalities Provided -> 

    1 ) Limits are mode configurable in the backend [
        Open index.js

      
          app.post('/api1',async (req,res)=>{

              const expiryTime = 60  //configurable expiryTime
              const totalNoOfRequests = 20 //configurable totalNoOfRequests
              return rateLimiterBase(expiryTime,totalNoOfRequests,req,res)

          })
          
        
    
    ]

    2 ) Input and Output are in json format 

    3 ) Implementation considering high speed ,availability and high volume
    4 ) Storing of rate limited requests for future debugging

