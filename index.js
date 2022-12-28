import http from "http"
import express from "express"
import logger from "morgan"
import cors from "cors"
import  rateLimiterBase from "./rateLimiter/index"

const app = express()

const port = process.env.PORT || "3000";
//get port from environment

app.use(cors());
//cors for backend to accept request from browser

app.set("port", port);
app.set('trust proxy', true)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.post('/api1',async (req,res)=>{

  const expiryTime = req.body.expiryTime
  const totalNoOfRequests = req.body.totalNoOfRequests
  return rateLimiterBase(expiryTime,totalNoOfRequests,req,res)

})


// catch 404 and forward to error handler //
app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
});









const server = http.createServer(app);



server.listen(port);


// Event listener for HTTP server "listening" event. //
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});


