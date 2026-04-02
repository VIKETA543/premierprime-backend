const { Pool } = require("pg");
require('dotenv').config();

const {
    PGHOST,PGDATABASE,PGUSER,PGPASSWORD,PGSSLMODE,PGCHANNELBINDING
}=process.env
const pool = new Pool({
  user: PGUSER, // or your custom username
  host: PGHOST,
  database: PGDATABASE, // A database name you created
  password: PGPASSWORD, // The password you set in Step 1
   port: 5432,
ssl:{required:PGSSLMODE},
 channel_binding:PGCHANNELBINDING,
    acquireTimeout: 100000,
   waitForConnections: true, // Whether to queue requests when no connections are available
    connectionLimit: 50000,     // Maximum number of connections in the pool
    queueLimit: 0, 
});
try{

  pool.connect().then((r)=>{
      console.log("conneccting to the database")
    if(r._connected){
        console.log("Successfuly connected to "+PGHOST)
        r.release()
    }else{
      console.log("Database connection failed")
         r.release()
    }  
 
  })
}catch(error){
  console.log(error)
}


module.exports = pool

