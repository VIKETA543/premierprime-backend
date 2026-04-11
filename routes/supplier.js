const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')







router.post('/listproductsofsuppliers', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT products.serialnumber,productbrand.brandid,productbrand.title,productbrand.imageurl,supplierprices.marketprice FROM products LEFT JOIN productbrand ON products.serialnumber=productbrand.productid LEFT JOIN supplierprices ON productbrand.brandid=supplierprices.brandid"
            r.query(query, (error, results) => {
                if (error) {

                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let rs = results.rows
                        console.log("Rows", rs)
                        r.release()
                        return res.status(200).json({ data: rs })
                    } else {
                        r.release();
                        return res.status(201).json({ message: "No products found for the specified supplier" })
                    }
                }
            })
        } else {
            return res.status(400).json({ message: "System could not connect to the database" })
        }

    })
})
// 



router.post('/saveprice', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log("Data", data)

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "INSERT INTO supplierprices (productid,brandid,marketprice,date) VALUES ($1,$2,$3,$4) ON CONFLICT (brandid) DO UPDATE SET marketprice = EXCLUDED.marketprice"
            r.query(query, [data.productid, data.brandid, data.marketprice, data.date], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(400).json({ message: error.detail })

                } else {
                    if (results.rowCount === 1) {
                        console.log(results)
                        r.release();
                        return res.status(200).json({ success: "Price updated successfully" })
                    } else {
                        r.release();
                        return res.status(201).json({ message: "Failed to update price" })
                    }

                }
            })
        } else {
            return res.status(400).json({ message: "System could not connect to the database" })
        }
    });
})

// 


router.post('/deleteprice', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log("Data", data)

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "DELETE FROM supplierprices WHERE brandid=$1"

            r.query(query, [data.brandid], (error, results) => {
                if (error) {
                    console.log(error)
                      r.release(); 
                     return res.status(201).json({ message: error.detail })
                  
                } else {
                    if (results.rowCount === 1) {
                        console.log(results)
                        r.release();
                        return res.status(200).json({ success: "Price deleted successfully" })
                    } else {
                        r.release();
                        return res.status(201).json({ message: "Failed to delete price" })
                    }

                }

            })

        } else {
            return res.status(400).json({ message: "System could not connect to the database" })
        }
    })
})
module.exports = router