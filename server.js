require('dotenv').config();
const http=require('http')
const app=require('./index')
const server=http.createServer(app)
server.maxHeaderSize =16*4096
server.listen(process.env.PORT||4000,(req,res)=>{
    console.log("Server connected at "+process.env.PORT||4000)
})
   