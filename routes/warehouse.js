const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')




router.post('/addidentity', cors({ origin: '*' }), async (req, res) => {
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
              let data=req.body
console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
console.log(data)
            query="INSERT INTO warehoustidentity(identityid,name,decription,date)VALUES($1,$2,$3,$4)"
            r.query(query,[data.identity,data.name,data.describe,data.date],(error,results)=>{
                    if(error){
                              console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                    }else{
                        if(results.rowCount>0){
                            r.release();
                            return res.status(200).json({success:"Identity successfully created"})
                        }else{
                            r.release()
                            return res.status(200).json({message:"Internal error has occured. Try again"})
                        }
                    }
            })

        }
        })
    })


module.exports = router