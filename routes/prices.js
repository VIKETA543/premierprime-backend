const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')

router.post('/addprice', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT productid,category,brandid,pricegroup FROM productprice WHERE productid=$1 AND category=$2 AND brandid=$3 AND pricegroup=$4"
                r.query(query, [data.productID, data.carteforyID, data.selectedBrand, data.pricetagID], (error, results) => {
                    if (error) {
                        console.log(error)
                           r.release()
                        return res.status(500).json({ message: "Internal server error occured while adding price object" })
                    } else {
                        if (results.rows.length > 0) {
                               r.release()
                            return res.status(201).json({ message: "This product has already been assigned a price" })
                        } else {
                            query = "INSERT INTO productprice(productid,category,brandid,pricegroup,dateadded,datemodified,orderprice,totalordercost,marupprice,unitesellingprice,cartsellingprice,priceid,misslaneousecost)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)"
                            r.query(query, [data.productID, data.carteforyID, data.selectedBrand, data.pricetagID, new Date(), new Date(), data.orderPrice, data.totalordercost, data.marupPrice, data.unitSellingPrice, data.cartsellingPrice, data.priceid,data.misslaneousecost], (error, results) => {
                                if (error) {
                                    console.log(error)
                                       r.release()
                                    return res.status(500).json({ message: "Internal server error occured while adding price object" })
                                } else {
                                    if (results.rowCount === 1) {
                                           r.release()
                                        return res.status(200).json({ success: "Request was successfull" })
                                    } else {
                                           r.release()
                                        return res.status(500).json({ message: "Request was rejected by server." })
                                    }
                                }
                            })
                        }
                    }
                })

            } catch (error) {
                console.log(error)
                   r.release()
                return res.status(200).json({ message: "Internal error occured" })
            }
        } else {
            r.release()
            return res.status(200).json({ message: "Connection failed" })
        }

    })

})
router.get('/priceTagdetails', cors({ origin: '*' }), async (req, res) => {
       
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT sn,pricetagid,pricetag,datemodified,description,auth FROM pricetag";
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let rs = results.rows
                     
                        r.release()
                        return res.status(200).json({ data: rs })
                    } else {
                        r.release();
                        console.log("Price Tag not set")
                        return res.status(201).json({ message: "No activity" })
                    }
                }

            })
        }
   
    })
    })
    router.get('/pricedetails', cors({ origin: '*' }), async (req, res) => {
        console.log("Price controle")
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query= "SELECT productprice.productid,products.name,productprice.category,prodcart.category_name,productprice.brandid,productbrand.title,productprice.orderprice,productprice.totalordercost,productprice.marupprice,productprice.unitesellingprice,productprice.cartsellingprice,productprice.misslaneousecost,pricetag.pricetag FROM productprice LEFT JOIN products ON  productprice.productid=products.serialnumber LEFT JOIN prodcart ON productprice.category=prodcart.serialnumber LEFT JOIN productbrand ON productprice.brandid=productbrand.brandid LEFT JOIN pricetag ON  productprice.pricegroup=pricetag.pricetagid ";
            r.query(query,(error,results)=>{
                if(error){
                          console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                          let rs = results.rows
                           
                    r.release()
                    return res.status(200).json({ data: rs })
                    }else{
                        r.release();
                        console.log("Price Tag not set")
                        return res.status(201).json({message:"No price activity"})
                    }
                }  

            })
            }  

    }) 
}) 



// 
router.post('/searchproductprices', cors({ origin: '*' }), async (req, res) => {
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
              let data=req.body
              console.log("Data",data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query= "SELECT productprice.productid,products.name,productprice.category,prodcart.category_name,productprice.brandid,productbrand.title,productprice.orderprice,productprice.totalordercost,productprice.marupprice,productprice.unitesellingprice,productprice.cartsellingprice,productprice.misslaneousecost,pricetag.pricetag FROM productprice LEFT JOIN products ON  productprice.productid=products.serialnumber LEFT JOIN prodcart ON productprice.category=prodcart.serialnumber LEFT JOIN productbrand ON productprice.brandid=productbrand.brandid LEFT JOIN pricetag ON  productprice.pricegroup=pricetag.pricetagid  WHERE productprice.productid=$1"  ;
            r.query(query,[data.selectedproduct],(error,results)=>{
                if(error){
                          console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                          let rs = results.rows
                           console.log("Rows", rs)
                    r.release()
                    return res.status(200).json({ data: rs })
                    }else{
                        r.release();
                        console.log("Price Tag not set")
                        return res.status(201).json({message:"No Prices have been attached to this product"})
                    }
                }  

            })
            }  

    }) 
}) 
// 


// 
router.post('/searchproductpricesbyCategory', cors({ origin: '*' }), async (req, res) => {
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
              let data=req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query= "SELECT productprice.productid,products.name,productprice.category,prodcart.category_name,productprice.brandid,productbrand.title,productprice.orderprice,productprice.totalordercost,productprice.marupprice,productprice.unitesellingprice,productprice.cartsellingprice,productprice.misslaneousecost,pricetag.pricetag FROM productprice LEFT JOIN products ON  productprice.productid=products.serialnumber LEFT JOIN prodcart ON productprice.category=prodcart.serialnumber LEFT JOIN productbrand ON productprice.brandid=productbrand.brandid LEFT JOIN pricetag ON  productprice.pricegroup=pricetag.pricetagid WHERE productprice.category=$1"  ;
            r.query(query,[data.cartId],(error,results)=>{
                if(error){
                          console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                          let rs = results.rows

                    r.release()
                    return res.status(200).json({ data: rs })
                    }else{
                        r.release();

                        return res.status(201).json({message:"No products prices have been assigned to this category"})
                    }
                }  

            })
            }  

    }) 
}) 








// Listing categorys for filter
router.get('/listcategory', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                const results = await r.query("SELECT serialnumber,category_name,image,imageurl FROM prodcart")
                let rs = results.rows

                if (rs.length > 0) {
                    //  console.log("Rows",rs)
                    r.release()
                    return res.status(200).json({ data: results.rows })
                } else {
                    console.log("NO activity")
                    return res.status(200).json({ message: "No Activity" })
                }
            } catch (error) {
                console.log(error)
                return res.status(200).json({ message: "Internal error occured" })
            }
        } else {
            r.release()
            return res.status(200).json({ message: "Connection failed" })
        }

    })
})



//listing prices by tag

// 
router.get('/listPricebytag', cors({ origin: '*' }), async (req, res) => {
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data=req.body
              
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query= "SELECT pricetagid,pricetag FROM pricetag";
            r.query(query,(error,results)=>{
                if(error){
                          console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                          let rs = results.rows
                        //    console.log("Rows", rs)
                    r.release()
                    return res.status(200).json({ data: rs })
                    }else{
                        r.release();
                        console.log("Price Tag not set")
                        return res.status(201).json({message:"No activity"})
                    }
                }  

            })
            }  

    })
})

// serching prices by price tags

router.post('/searchPricesbyTag', cors({ origin: '*' }), async (req, res) => {
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
              let data=req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query= "SELECT productprice.productid,products.name,productprice.category,prodcart.category_name,productprice.brandid,productbrand.title,productprice.orderprice,productprice.totalordercost,productprice.marupprice,productprice.unitesellingprice,productprice.cartsellingprice,productprice.misslaneousecost,pricetag.pricetag FROM productprice LEFT JOIN products ON  productprice.productid=products.serialnumber LEFT JOIN prodcart ON productprice.category=prodcart.serialnumber LEFT JOIN productbrand ON productprice.brandid=productbrand.brandid  LEFT JOIN pricetag ON  productprice.pricegroup=pricetag.pricetagid WHERE productprice.pricegroup=$1"  ;
            r.query(query,[data.pricetagid],(error,results)=>{
                if(error){
                          console.log("The error ", error)
                                    r.release();
                            return res.status(400).json({ message: error.detail })
                }else{
                    if(results.rows.length>0){
                          let rs = results.rows
                        console.log(rs)
                    r.release()
                    return res.status(200).json({ data: rs })
                    }else{
                        r.release();

                        return res.status(201).json({message:"No products prices have been assigned to this category"})
                    }
                }  

            })
            }  

    }) 
}) 




module.exports = router