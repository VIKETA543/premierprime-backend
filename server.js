require('dotenv').config();
const http=require('http')
const pool=require('./dbconnectivity')
const app=require('./index')
const server=http.createServer(app)
server.maxHeaderSize =16*4096
server.listen(process.env.PORT||4000,(req,res)=>{
    console.log("Server connected at "+process.env.PORT||4000)


})

// This must be inside an 'async' function
async function connectToDb() {
  try {
    console.log("Attempting to connect to the database...");
    
    // Execution pauses here until the promise settles
    const client = await pool.connect(); 
    
    console.log("Successfully connected to " + PGHOST);
    
    // Always release the client back to the pool
    client.release();
    
  } catch (error) {
    // This will now catch database connection failures!
    console.error("Database connection failed:", error.message);
  }
}
   