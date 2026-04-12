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
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log(data)
            query = "INSERT INTO warehoustidentity(identityid,name,decription,date)VALUES($1,$2,$3,$4)"
            r.query(query, [data.identity, data.name, data.describe, data.date], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: "Identity successfully created" })
                    } else {
                        r.release()
                        return res.status(200).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})



router.get('/listidentities', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="SELECT identityid,name,decription,date,auth FROM warehoustidentity"
            r.query(query,(error,results)=>{
                if(error){

                         console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                   console.log(results)
                    r.release();
                    return res.status(200).json({data:results.rows})
                    }else{
                             console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: 'No records available' })
                    }
                }
            })

        }
    })
})


// auth


router.post('/auth', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="UPDATE warehoustidentity SET auth=$1 WHERE  identityid=$2 "
            r.query(query,[data.auth,data.id],(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rowCount>0){
                               
                    r.release();
                    return res.status(200).json({ success: 'Authorisation successful' })
                    }else{
                            r.release();
                    return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})




router.post('/delIdentity', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
   console.log(data)   
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="DELETE FROM  warehoustidentity  WHERE  identityid=$1 "
            r.query(query,[data.identityid],(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rowCount>0){
                             
                    r.release();
                    return res.status(200).json({ success: 'Object successfully removed' })
                    }else{
                            r.release();
                    return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})





router.post('/updateIdentity', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="UPDATE warehoustidentity SET name=$1,decription=$2,date=$3 WHERE  identityid=$4 "
            r.query(query,[data.name,data.describe,data.date,data.identity],(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rowCount>0){    
                    r.release();
                    return res.status(200).json({ success: 'Authorisation successful' })
                    }else{
                            r.release();
                    return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.get('/listwarehouses', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query=" SELECT warehouse.serialnumber,warehouse.identityid,warehouse.warehousename,warehouse.location,warehouse.digitaladdress,warehouse.decription,warehouse.date,warehouse.isopened,warehoustidentity.name FROM warehouse LEFT JOIN warehoustidentity ON warehouse.identityid=warehoustidentity.identityid"
            r.query(query,(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){    
                    r.release();
                    return res.status(200).json({ data: results.rows })
                    }else{
                            r.release();
                    return res.status(400).json({ message: "No warehouse details. Create a new Warehouse" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})




// saveWearhouse

router.post('/saveWearhouse', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log(data)
            query = "INSERT INTO warehouse(serialnumber,identityid,warehousename,location,digitaladdress,decription,date,isopened)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
            r.query(query, [data.warehouseSerial, data.identity, data.warehouseTitle, data.warehouseLocation,data.warehousedigialAddress,data.warehouseDescription,data.date,false], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: "Identity successfully created" })
                    } else {
                        r.release()
                        return res.status(200).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})

// isopened




router.post('/addidentity', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log(data)
            query = "INSERT INTO warehoustidentity(identityid,name,decription,date)VALUES($1,$2,$3,$4)"
            r.query(query, [data.identity, data.name, data.describe, data.date], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: "Identity successfully created" })
                    } else {
                        r.release()
                        return res.status(200).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})



router.get('/listidentities', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="SELECT identityid,name,decription,date,auth FROM warehoustidentity"
            r.query(query,(error,results)=>{
                if(error){

                         console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                   console.log(results)
                    r.release();
                    return res.status(200).json({data:results.rows})
                    }else{
                             console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: 'No records available' })
                    }
                }
            })

        }
    })
})


// auth


router.post('/isopened', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="UPDATE warehouse SET isopened=$1 WHERE  serialnumber=$2 "
            r.query(query,[data.isopened,data.id],(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rowCount>0){
                               
                    r.release();
                    return res.status(200).json({ success: 'Authorisation successful' })
                    }else{
                        console.log("Not found")
                            r.release();
                    return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})
// delete warehouse

router.post('/dropwarehouse', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query="DELETE FROM  warehouse  WHERE  serialnumber=$1 "
            r.query(query,[data.id],(error,results)=>{
                if(error){
                               console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rowCount>0){
                               
                    r.release();
                    return res.status(200).json({ success: 'Warehouse has been removed' })
                    }else{
             
                            r.release();
                    return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        }else{
              return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})

module.exports = router