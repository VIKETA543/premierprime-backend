const express=require("express");
const pool=require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router=express.Router()

router.get('/displayProducts',cors({ origin: '*' }),async (req,res)=>{
       res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
   await pool.connect().then(async (r)=>{
    if(r._connected){
        try{
          query="SELECT products.serialnumber,products.name,products.description,products.image,products.inventorystatus,prodcart.category_name,productbrand.title,productbrand.imageurl,productprice.unitesellingprice FROM products LEFT JOIN prodcart ON  products.category=prodcart.serialnumber LEFT JOIN productbrand ON products.serialnumber=productbrand.productid LEFT JOIN productprice ON productbrand.brandid=productprice.brandid"
          r.query(query, (error, results) => {
            if(error){
                r.release()
            console.log(error)
            }else{
             
              if(results.rows.length>0){
                //  console.log(results.rows)
                  r.release()
        return res.status(200).json({arrival:results.rows})
              }else{
                 r.release()
         
                 return res.status(200).json({message:"No Activity"})
              }
            }

          })
        }catch(error){
               r.release()
            console.log(error)
                 return res.status(200).json({message:"Internal error occured"})
        }
    }else{
          r.release()
       return res.status(200).json({message:"Connection failed"})  
    }
       
  })
})  
 

router.get('/listproduct',cors({ origin: '*' }),async (req,res)=>{
       res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
   await pool.connect().then(async (r)=>{
    if(r._connected){
        try{
          query="SELECT products.serialnumber,products.name,products.image,products.category,products.imageurl,products.description,prodcart.category_name,products.date_created FROM products LEFT JOIN prodcart ON products.category=prodcart.serialnumber"
          r.query(query, (error, results) => {
            if(error){
                r.release()
            console.log(error)
            }else{
             
              if(results.rows.length>0){
                 console.log("rows=>",results.rows)
                  r.release()
        return res.status(200).json({data:results.rows})
              }else{
                 r.release()
         
                 return res.status(200).json({message:"No Activity"})
              }
            }

          })
        }catch(error){
               r.release()
            console.log(error)
                 return res.status(200).json({message:"Internal error occured"})
        }
    }else{
          r.release()
       return res.status(200).json({message:"Connection failed"})  
    }
       
  })
}) 



router.post('/listproductbyCart',cors({ origin: '*' }),async (req,res)=>{
  let data=req.body

       res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
   await pool.connect().then(async (r)=>{
    if(r._connected){
        try{
          query="SELECT serialnumber,name,image,category,imageurl FROM products WHERE category=$1"
          r.query(query, [data.cartID], (error, results) => {
            if(error){
                r.release()
            console.log(error)
            }else{
             
              if(results.rows.length>0){
                //  console.log("rows numbers=>",results.rows)
                  r.release()
        return res.status(200).json({data:results.rows})
              }else{
                 r.release()
         
                 return res.status(200).json({message:"No product has been assigned to the category"})
              }
            }

          })
        }catch(error){
               r.release()
            console.log(error)
                 return res.status(200).json({message:"Internal error occured"})
        }
    }else{
          r.release()
       return res.status(200).json({message:"Connection failed"})  
    }
       
  })
}) 


router.get('/trending',cors({ origin: '*' }),async (req,res)=>{
       res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
   await pool.connect().then(async (r)=>{
    if(r._connected){
        try{
          query="SELECT * FROM products WHERE productstate = $1"
          r.query(query, ['TRENDING'], (error, results) => {
            if(error){
                r.release()
            console.log(error)
            }else{
              if(results.rows.length>0){
                  r.release()
        return res.status(200).json({trending:results.rows})
              }else{
                 r.release()
         
                 return res.status(200).json({message:"No Activity"})
              }
            }
   
          })   
        }catch(error){
               r.release()
            console.log(error)
                 return res.status(200).json({message:"Internal error occured"})
        }
    }else{
          r.release()
       return res.status(200).json({message:"Connection failed"})  
    }
       
  })
})



router.get('/cartegories',cors({ origin: '*' }),async (req,res)=>{
     res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
   await pool.connect().then(async (r)=>{
    if(r._connected){
        try{
             const results =await r.query("SELECT serialnumber,category_name,image,imageurl FROM prodcart")
            let rs=results.rows
            // console.log("Rows",rs)
                if(rs.length>0){
            for (let i = 0; i < rs.length; i++) {
                        if (rs[i].image !== null) {
                            var base64 = Buffer.from(rs[i].image);
                            var BufferedBase64 = base64.toString('base64')
                            rs[i].image = BufferedBase64
                        } else {
                            rs[i].image = undefined
                        }
                       
                    }

        r.release()
        return res.status(200).json({data:results.rows})
                }else{
                    console.log("NO activity")
                  return res.status(200).json({message:"No Activity"})  
                }
        }catch(error){
            console.log(error)
                 return res.status(200).json({message:"Internal error occured"})
                 }
    }else{
          r.release()
       return res.status(200).json({message:"Connection failed"})  
    }
       
  })
})
module.exports=router