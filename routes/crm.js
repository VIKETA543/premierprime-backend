const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const { put } = require('@vercel/blob');

 


router.post('/addCustomer', cors({ origin: '*' }), async (req, res) => {
 
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data=req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query='INSERT INTO customers(customer_number,dateposted,is_verified,customername,telephone,emailadress,addresss,mobile_number,customertype,remarks)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
            r.query(query,[data.cutomerNumber,data.dateposted,true,data.customername,data.telephone,data.emailadress,data.addresss,data.mobileNumber,data.customerType,data.remarks],(error,results)=>{
                if(error){
                    console.log(error)
                    res.status(201).json({message:error})
                }else{
                    if(results.rowCount>0){
                       return res.status(200).json({success:'Custommer successfuly added'})
                    }else{
                        return res.status(200).json({message:'Unknown error has occured'})
                    }
                }
            })


        }else{
            return res.status(201).json({message:'Failed to connect to the database'})
        }
    })
})







router.get('/loadcustomers', cors({ origin: '*' }), async (req, res) => {
 
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data=req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query='SELECT  customer_number,dateposted,is_verified,customername,telephone,emailadress,addresss,mobile_number,customertype,remarks FROM customers '
            r.query(query,(error,results)=>{
                if(error){
                    console.log(error)
                    res.status(201).json({message:error})
                }else{
                    if(results.rows.length>0){
                       return res.status(200).json({data:results.rows})
                    }else{
                        return res.status(200).json({message:'Unknown error has occured'})
                    }
                }
            })

        }else{
            return res.status(201).json({message:'Failed to connect to the database'})
        }
    })
})

module.exports=router