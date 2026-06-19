const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const { put } = require('@vercel/blob');



const config = { api: { bodyParser: false } };

router.get('/cartlist', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Data', data)
    await pool.connect().then(async (r) => {

        if (r._connected) {
            try {
                query = `SELECT serialnumber,category_name,description,image,date_updated,imageurl FROM prodcart `
                await r.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        console.log("NO FOUND CAT activity")
                        return res.status(200).json({ message: error.detail })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            console.log("NO FOUND CAT activity")
                            return res.status(200).json({ message: "No Activity" })
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



router.post('/categoryListByStore', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Data', data)
    await pool.connect().then(async (r) => {

        if (r._connected) {
            try {
                query = `SELECT serialnumber,category_name,description,image,date_updated,imageurl FROM prodcart LEFT JOIN store_products ON store_products.product_category=prodcart.serialnumber WHERE store_products.store_number=$1`
                await r.query(query, [data.store_number], (error, results) => {
                    if (error) {
                        console.log(error)
               
                        return res.status(200).json({ message: error.detail })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            console.log('cartegory list by store', results.rows )
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                 
                            return res.status(200).json({ message: "No Activity" })
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



// const storage = multer.memoryStorage();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category_images'); // Make sure this 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Add timestamp to avoid name conflicts
    }
});
const upload = multer({ storage: multer.memoryStorage() });


router.post('/addcart', upload.single('IMAGE'), async (req, res) => {
    let data = req.body

    if (!req.file) {

        return res.status(400).send('No file uploaded.');
    } else {


        const blob = await put(`uploads/category_images/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,

        });


        let imgData = req.file
        // console.log(imgData)
        res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        await pool.connect().then(async (r) => {
            if (r._connected) {
                try {
                    console.log('Saving categories')
                    query = "INSERT INTO prodcart(serialnumber,category_name,description,image,date_updated,ImageUrl)VALUES($1,$2,$3,$4,$5,$6)"
                    r.query(query, [data.serialnumber, data.newCategory, data.description, imgData.originalname, new Date(), blob.url], (error, results) => {
                        if (error) {
                            console.log(error)
                            r.release()
                        } else {
                            //         
                            if (results.rowCount > 0) {
                                // console.log(results)
                                r.release()
                                return res.status(200).json({ success: "Request was successful" })
                            } else {
                                r.release()
                                return res.status(200).json({ message: "Request failed" })
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

    }
})
router.post('/trashcart', cors({ origin: '*' }), async (req, res) => {
    // console.log(imgData)
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "DELETE FROM  prodcart WHERE serialnumber = $1 RETURNING *"
                r.query(query, [data.serial], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                    } else {
                        console.log(results)
                        if (results.rowCount > 0) {
                            console.log(results)
                            r.release()
                            return res.status(200).json({ success: "Request was successful" })
                        } else {
                            r.release()
                            return res.status(200).json({ message: "Request failed" })
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

router.post('/clearrecords', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "DELETE FROM  prodcart RETURNING *"
                r.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                    } else {
                        console.log(results)
                        if (results.rowCount > 0) {
                            console.log(results)
                            r.release()
                            return res.status(200).json({ success: "Request was successful" })
                        } else {
                            r.release()
                            return res.status(200).json({ message: "Request failed" })
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



// const storage = multer.memoryStorage();

const pro_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/product_images'); // Make sure this 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Add timestamp to avoid name conflicts
    }
});
// const pro_upload = multer({ storage: pro_storage });
const pro_upload = multer({ storage: multer.memoryStorage() });


router.post('/addproduct', pro_upload.single('IMAGE'), cors({ origin: '*' }), async (req, res) => {
    let data = req.body

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    } else {

        // const fileUrl = `${req.protocol}://${req.get('host')}/product_images/${req.file.filename}`;
        // console.log(fileUrl)
        // ${req.file.filename}
        let imgData = req.file
        // console.log(imgData)

        const blob = await put(`uploads/product_images/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,

        });


        console.log(blob.url)


        res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        console.log(data)
        await pool.connect().then(async (r) => {
            if (r._connected) {
                try {
                    query = "INSERT INTO products(serialnumber,name,description,image,category,date_created,imageurl,created_by)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                    r.query(query, [data.productId, data.productName, data.description, imgData.originalname, data.catergory, data.date, blob.url, data.uac_id], (error, results) => {
                        if (error) {
                            console.log(error)
                            r.release()
                            return res.status(200).json({ message: "Internal error occured" })
                        } else {
                            //         
                            if (results.rowCount > 0) {

                                if (data.store_number) {
                                    query = "INSERT INTO store_products(product_number,product_category,date_created,isopened,store_number,stock_number,created_by)VALUES($1,$2,$3,$4,$5,$6,$7)"
                                    r.query(query, [data.productId, data.catergory, new Date(), false, data.store_number, data.stock_number, data.uac_id], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(200).json({ message: "Product was created but failed to be added to store inventory" })
                                        } else {
                                            if (results.rowCount > 0) {
                                                r.release()
                                                return res.status(200).json({ success: "Request was successful" })
                                            }
                                        }
                                    })

                                } else {
                                    r.release()
                                    return res.status(200).json({ message: "Store details could not be found" })
                                }
                            } else {
                                r.release()
                                return res.status(200).json({ message: "Request failed" })
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

    }
})


router.get('/listbrnd', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                const results = await r.query("SELECT brandid,title,role,image,date_created,imageurl FROM productbrand")
                let rs = results.rows

                if (rs.length > 0) {

                    r.release()
                    return res.status(200).json({ data: results.rows })
                } else {
                    r.release()
                    console.log("NO activity")
                    return res.status(200).json({ message: "No Activity" })
                }
            } catch (error) {
                r.release()
                console.log(error)
                return res.status(200).json({ message: "Internal error occured" })
            }
        } else {
            r.release()
            return res.status(200).json({ message: "Connection failed" })
        }

    })
})
// 

router.post('/listbrndbyID', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    console.log("Loading=", data)
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT brandid,title,role,image,date_created,imageurl FROM productbrand WHERE productid=$1"
                r.query(query, [data.selectedproduct], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                    } else {
                        console.log(results.rows)
                        if (results.rows.length > 0) {
                            let rs = results.rows

                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            return res.status(200).json({ message: "No Brands have been added to this product" })
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

router.get('/brnddata', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                const results = await r.query("SELECT productbrand.brandid,productbrand.title,productbrand.role,productbrand.image,productbrand.productid,productbrand.date_created,productbrand.imageurl,products.name,prodcart.category_name FROM productbrand LEFT JOIN products ON productbrand.productid=products.serialnumber LEFT JOIN prodcart ON products.category=prodcart.serialnumber ")
                let rs = results.rows

                if (rs.length > 0) {
                    // console.log("Rows", rs)
                    r.release()
                    return res.status(200).json({ data: results.rows })
                } else {
                    console.log("No Results ")
                    return res.status(200).json({ message: "No Activity" })
                }
            } catch (error) {
                r.release()
                console.log(error)
                return res.status(200).json({ message: "Internal error occured" })
            }
        } else {
            r.release()
            return res.status(200).json({ message: "Connection failed" })
        }

    })
})

// 

router.post('/dropbrnd', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let data = req.body
    console.log("the body", data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "DELETE FROM  productbrand WHERE brandid=$1 RETURNING *"
                r.query(query, [data.brandID], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                    } else {
                        console.log(results)

                        console.log(results)
                        r.release()
                        return res.status(200).json({ success: "Request was successful" })

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


router.post('/selbrnd', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT productbrand.brandid,productbrand.title,productbrand.role,productbrand.image,productbrand.productcart,productbrand.date_created,productbrand.imageurl,prodcart.category_name FROM productbrand LEFT JOIN prodcart ON productbrand.productcart=prodcart.serialnumber WHERE productbrand.brandid=$1";
            r.query(query, [data.brandID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
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
                        return res.status(201).json({ message: "No activity" })
                    }
                }

            })
        }

    })
})


//adding a new brand

const brand_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/brand_images'); // Make sure this 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Add timestamp to avoid name conflicts
    }
});
// const brand_upload = multer({ storage: brand_storage });
const brand_upload = multer({ storage: multer.memoryStorage() });
router.post('/addbrnd', brand_upload.single('image'), cors({ origin: '*' }), async (req, res) => {

    let data = req.body

    if (!req.file) {
        return res.status(400).json({ message: 'Invalid file' });
    } else {

        const blob = await put(`uploads/brand_images/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,

        });

        // const fileUrl = `${req.protocol}://${req.get('host')}/brand_images/${req.file.filename}`;
        console.log(data)
        let imgData = req.file
        res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
        await pool.connect().then(async (r) => {
            if (r._connected) {
                try {
                    query = "INSERT INTO productbrand(brandid,title,role,image,date_created,imageurl,productid) VALUES($1,$2,$3,$4,$5,$6,$7)"
                    r.query(query, [data.BrandId, data.BrandName, data.BrandRole, imgData.filename, new Date(), blob.url, data.serialnumber], (error, results) => {
                        if (error) {
                            console.log("The error ", error)
                            r.release();
                            return res.status(400).json({ message: error.detail })
                        } else {
                            r.release();
                            return res.status(200).json({ success: "Request was successful" })
                        }
                    })
                } catch (error) {
                    console.log(error)
                    r.release()
                    return res.status(200).json({ message: "Internal error occured" })
                }
            }
        })
    }
})

// listing prices 

router.get('/listprices', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT productid,productid,orderprice,totalordercost,marupprice,unitesellingprice,cartsellingprice FROM productprice";
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let rs = results.rows
                        //    console.log("Rows", rs)
                        r.release()
                        return res.status(200).json({ data: rs })
                    } else {
                        r.release();
                        console.log("No Activity")
                        return res.status(201).json({ message: "No activity" })
                    }
                }

            })
        }

    })
})


// listpriceTag
router.get('/listpriceTag', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT pricetagid,pricetag FROM pricetag";
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let rs = results.rows
                        //    console.log("Rows", rs)
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
//add a new price quote

router.post('/submitquote', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    console.log(data)
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "INSERT INTO pricetag(pricetagid,pricetag,datemodified,description,auth) VALUES($1,$2,$3,$4,$5)"
                r.query(query, [data.quoteID, data.priceTag, new Date(), data.quoteDescription, false], (error, results) => {
                    if (error) {
                        console.log("The error ", error)
                        r.release();
                        return res.status(400).json({ message: error.detail })
                    } else {

                        console.log(results.rowCount)
                        if (results.rowCount === 1) {
                            r.release();
                            return res.status(200).json({ success: "Request was successful" })
                        } else {
                            r.release();
                            return res.status(200).json({ message: "Request was rejected " })
                        }

                    }
                })
            } catch (error) {
                console.log(error)
                r.release()
                return res.status(200).json({ message: "Internal error occured" })
            }
        }
    })

})

//price tag details


router.post('/droppricetag', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let data = req.body
    console.log("the body", data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "DELETE FROM  pricetag WHERE pricetagid=$1 RETURNING *"
                r.query(query, [data.taggedID], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                    } else {

                        let rs = results.rows
                        console.log(results)
                        r.release()
                        return res.status(200).json({ success: "Request was successful", data: rs })

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
// 




router.post('/authtag', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let data = req.body
    console.log("the body", data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "UPDATE  pricetag SET auth=$1 WHERE pricetagid=$2 RETURNING *"
                r.query(query, [data.auth, data.tagId], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                    } else {
                        if (results.rowCount > 0) {
                            let rs = results.rows
                            console.log(results)
                            r.release()
                            return res.status(200).json({ success: "Request was successful", data: rs })
                        } else {
                            r.release()
                            return res.status(200).json({ message: "Sorry, update failed" })
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






router.post('/dropProduct', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let data = req.body
    console.log("the body", data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                r.query('BEGIN')
                query = "DELETE  FROM products  WHERE serialnumber=$1 RETURNING *"
                r.query(query, [data.product_number], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(200).json({ message: "Sorry, an error occurred" })
                        r.release()
                    } else {
                        if (results.rowCount > 0) {
                            if (data.store_number) {
                                query = "DELETE  FROM store_products  WHERE product_number=$1 RETURNING *"
                                r.query(query, [data.product_number], (error, results) => {
                                    if (error) {
                                        r.query('ROLLBACK')
                                        console.log(error)
                                        return res.status(200).json({ message: "Sorry, an error occurred" })
                                        r.release()
                                    } else {
                                        if (results.rowCount > 0) {
                                            r.release()
                                            r.query('COMMIT')
                                            return res.status(200).json({ success: "Request was successful" })
                                        } else {
                                            r.release()
                                            r.query('ROLLBACK')
                                            return res.status(200).json({ message: "Product could not be deleted" })
                                        }
                                    }
                                })
                            } else {
                                r.release()
                                return res.status(200).json({ success: "Request was successful" })
                            }


                        } else {
                            r.release()
                            return res.status(200).json({ message: "Sorry, update failed" })
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





module.exports = router       