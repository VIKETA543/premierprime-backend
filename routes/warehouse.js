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
            query = "INSERT INTO warehoustidentity(identityid,warehoustidentity_name,decription,date)VALUES($1,$2,$3,$4)"
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
            query = "SELECT identityid,warehoustidentity_name,decription,date,auth FROM warehoustidentity"
            r.query(query, (error, results) => {
                if (error) {

                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log(results)
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {
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
            query = "UPDATE warehoustidentity SET auth=$1 WHERE  identityid=$2 "
            r.query(query, [data.auth, data.id], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {

                        r.release();
                        return res.status(200).json({ success: 'Authorisation successful' })
                    } else {
                        r.release();
                        return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
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
            query = "DELETE FROM  warehoustidentity  WHERE  identityid=$1 "
            r.query(query, [data.identityid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {

                        r.release();
                        return res.status(200).json({ success: 'Object successfully removed' })
                    } else {
                        r.release();
                        return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
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
            query = "UPDATE warehoustidentity SET warehoustidentity_name=$1,decription=$2,date=$3 WHERE  identityid=$4 "
            r.query(query, [data.name, data.describe, data.date, data.identity], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: 'Authorisation successful' })
                    } else {
                        r.release();
                        return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})




router.post('/addidentity', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log(data)
            query = "INSERT INTO warehoustidentity(identityid,warehoustidentity_name,decription,date)VALUES($1,$2,$3,$4)"
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
            query = "SELECT identityid,warehoustidentity_name,decription,date,auth FROM warehoustidentity"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {
                        console.log("The error ", error)
                        r.release();
                        return res.status(400).json({ message: 'No records available' })
                    }
                }
            })

        }
    })
})





router.get('/listwarehouses', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = " SELECT warehouse.whse_serialnumber,warehouse.identityid,warehouse.warehousename,warehouse.location,warehouse.digitaladdress,warehouse.decription,warehouse.date,warehouse.isopened,warehoustidentity.warehoustidentity_name FROM warehouse LEFT JOIN warehoustidentity ON warehouse.identityid=warehoustidentity.identityid"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release();
                        return res.status(400).json({ message: "No warehouse details. Create a new Warehouse" })
                    }
                }
            })
        } else {
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

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "INSERT INTO warehouse(whse_serialnumber,identityid,warehousename,location,digitaladdress,decription,date,isopened)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
            r.query(query, [data.warehouseSerial, data.identity, data.warehouseTitle, data.warehouseLocation, data.warehousedigialAddress, data.warehouseDescription, data.date, false], (error, results) => {
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




// auth


router.post('/isopened', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "UPDATE warehouse SET isopened=$1 WHERE  whse_serialnumber=$2 "
            r.query(query, [data.isopened, data.id], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {

                        r.release();
                        return res.status(200).json({ success: 'Authorisation successful' })
                    } else {
                        console.log("Not found")
                        r.release();
                        return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
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
            query = "DELETE FROM  warehouse  WHERE  whse_serialnumber=$1 "
            r.query(query, [data.id], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: 'Warehouse has been removed' })
                    } else {

                        r.release();
                        return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})


// updaterecords

router.post('/updaterecords', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "UPDATE warehouse SET identityid=$1,warehousename=$2,location=$3,digitaladdress=$4,decription=$5,date=$6 WHERE  whse_serialnumber=$7 "
            r.query(query, [data.identity, data.warehouseTitle, data.warehouseLocation, data.warehousedigialAddress, data.warehouseDescription, data.updateDate, data.warehouseSerial], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    r.release();
                    console.log(results)
                    return res.status(200).json({ success: 'Update complete' })
                }
            })
        } else {
            return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})

// 

router.post('/findwarehouseforOperation', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT whse_serialnumber FROM warehouse WHERE whse_serialnumber=$1 "
            r.query(query, [data.selectedWarehouseoperationID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = 'SELECT  warehousestock.cartegory,warehousestock.warehouseid,warehouse.warehousename,warehousestock.productid, warehousestock.whse_stockid,warehousestock.identityid,products.name,warehousestock.dateopened,warehousestock.dateclosed,warehousestock.details,warehousestock.isopened,prodcart.category_name FROM warehousestock' +
                            ' LEFT JOIN prodcart ON warehousestock.cartegory=prodcart.serialnumber LEFT JOIN products ON  warehousestock.productid=products.serialnumber LEFT JOIN warehouse ON warehousestock.warehouseid=warehouse.whse_serialnumber  WHERE warehousestock.warehouseid=$1'
                        r.query(query, [data.selectedWarehouseoperationID], (error, results) => {
                            if (error) {
                                r.release();
                                console.log(error)
                                return res.status(201).json({ message: error.sqlMessage })
                            } else {
                                if (results.rows.length > 0) {
                                   r.release();
                                    res.status(200).json({ data: results.rows })
                                } else {
                                 r.release();
                                    return res.status(201).json({ message: 'No products have been stocked for this warehouse. Add new product' })
                                }
                            }
                        })
                    } else {
                        r.release();

                        return res.status(201).json({ message: 'Invalid Warehouse' })
                    }

                }
            })
        } else {
            return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})


// loadproductinfo

router.post('/productCartegeory', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT serialnumber,category_name FROM  prodcart "
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let productCartegeory = results.rows

                        return res.status(200).json({ productCart: productCartegeory })
                    } else {

                    }
                }
            })
        } else {
            return res.status(400).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.post('/products', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT serialnumber,name FROM products WHERE category=$1"
            r.query(query, [data.productCartegory], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        const products = results.rows
                        return res.status(200).json({ Product: products })
                    } else {
                            r.release();
            return res.status(201).json({ message: "No products have been registered for this category" })
                    }
                }
            })
        } else {

            r.release();
            return res.status(400).json({ message: "Internal error has prevented the system from fulfilling your request" })
        }
    })
})


router.post('/productBrand', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {


            query = "SELECT brandid,title FROM productbrand WHERE productid=$1"
            r.query(query, [data.productid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        return res.status(200).json({ brand: results.rows })
                        r.release();
                        return res.status(200).json({ cart: productCartegeory, Product: products, brand: productBrand })

                    } else {
                        return res.status(201).json({ message: "No available brands" })
                    }
                }
            })


        } else {

        }

    })
})








// 


router.post('/savenewstock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT productid FROM warehousestock WHERE productid=$1'
            r.query(query, [data.productid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log("The error ", error)
                        r.release();
                        return res.status(201).json({ message: 'The selected product object has already been created. Use add stock option to stock the product ' })
                    } else {
                        query = "INSERT INTO warehousestock(whse_stockid,identityid,warehouseid,productid,dateopened,details,isopened,cartegory)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"

                        r.query(query, [data.warehouseStockID, data.warehouseIdentity, data.warehouseid, data.productid, data.dateOpened, data.comment, data.isOpened, data.productCartegory], (error, results) => {

                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                console.log("1 saved")
                                if (results.rowCount > 0) {
                                    // query = "INSERT INTO warehouse_product_stock(warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproductopeningqty,datedopened,comments,isstockopemend)" +
                                    //     "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
                                    // r.query(query, [data.warehouseStockID, data.productCartegory, data.productBrand, data.warehouseid, data.productid, data.openeningstock, data.dateOpened, data.comment, data.isOpened],
                                    //     (error, results) => {
                                    //         if (error) {
                                    //             console.log(error)
                                    //             r.release()
                                    //             return res.status(201).json({ message: error.detail })
                                    //         } else {
                                    //             if (results.rowCount > 0) {
                                    //                 r.release()
                                    //                 return res.status(200).json({ success: 'Request complete' })
                                    //             } else {
                                    //                 r.release()
                                    //                 console.log(error)
                                    //                 return res.status(200).json({ message: 'Unidentified error has occured' })
                                    //             }
                                    //         }

                                    //     })
                                    r.release()
                                    return res.status(200).json({ success: 'Request complete' })

                                } else {

                                }

                            }
                        })
                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})

router.post('/dropstock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "DELETE FROM  warehousestock  WHERE  whse_stockid=$1 "
            r.query(query, [data.whse_stockid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rowCount === 1) {
                        r.release();
                        return res.status(200).json({ success: 'Warehouse has been removed' })
                    } else {

                        r.release();
                        return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})




// updatestock

router.post('/updatestock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT * FROM  warehousestock WHERE whse_stockid=$1'
            r.query(query, [data.warehouseStockID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {

                    if (results.rows.length > 0) {
                        var rws = results.rows[0].isopened
                        if (rws === false) {
                            r.release();
                            return res.status(201).json({ message: 'Stock already closed. No operation can be performed on this stock object' })
                        } else {

                            query = "UPDATE warehousestock SET identityid=$1,warehouseid=$2,productid=$3,dateopened=$4,details=$5,isopened=$6,cartegory=$7 WHERE whse_stockid=$8 "

                            r.query(query, [data.warehouseIdentity, data.warehouseid, data.productid, data.dateOpened, data.comment, data.isOpened, data.productCartegory, data.warehouseStockID], (error, results) => {

                                if (error) {
                                    console.log("The error ", error)
                                    r.release();
                                    return res.status(201).json({ message: error.detail })
                                } else {
                                    console.log("1 saved")
                                    if (results.rowCount > 0) {
                                        query = " UPDATE  warehouse_product_stock SET productstockcartegory=$1,warehouseproductstckbrand=$2,warehousenumber=$3,warehouseproductstockproductid=$4,wareshouseproductopeningqty=$5,datedopened=$6,comments=$7,isstockopemend=$8  WHERE warehouseproductstockid=$9"
                                        r.query(query, [data.productCartegory, data.productBrand, data.warehouseid, data.productid, data.openeningstock, data.dateOpened, data.comment, data.isOpened, data.warehouseStockID],
                                            (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error.detail })
                                                } else {
                                                    if (results.rowCount === 1) {
                                                        r.release()
                                                        return res.status(200).json({ success: 'Request complete' })
                                                    } else {
                                                        r.release()
                                                        console.log(error)
                                                        return res.status(200).json({ message: 'Unidentified error has occured' })
                                                    }
                                                }

                                            })
                                    } else {

                                    }

                                }
                            })
                        }
                    } else {
                        r.release();
                        return res.status(201).json({ message: 'Selected stock dows not exist' })
                    }
                }
            })


        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})




// isStckOpened


router.post('/isStckOpened', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    let isClose = data.auth
    var date;

    if (isClose === false) {
        date = new Date()
    }
    console.log('dtae', date)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "UPDATE warehousestock SET isopened=$1,dateclosed=$2 WHERE  whse_stockid=$3 "
            r.query(query, [data.auth, date, data.warehouseStockId], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log(results)

                    query = 'UPDATE warehouse_product_stock SET isstockopemend=$1,dateclosed=$2 WHERE warehouseproductstockid=$3'
                    r.query(query, [data.auth, date, data.warehouseStockId], (error, results) => {
                        if (error) {
                            console.log("The error ", error)
                            r.release();
                            return res.status(201).json({ message: error.detail })
                        } else {
                            r.release();
                            return res.status(200).json({ success: 'Stock successfully update' })

                        }
                    })
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


// 



router.post('/loadforIncoming', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT products.serialnumber,products.name,products.category,productbrand.brandid,productbrand.title  FROM products LEFT JOIN productbrand ON products.serialnumber=productbrand.productid WHERE  productbrand.productid=$1'

            r.query(query, [data.stockId], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {

                        // r.release();

                        // return res.status(200).json({ data: results.rows })
                        let rs = results.rows
                        query = "SELECT controlid,controlname,dateposted,details,status FROM stockoperation_controls WHERE controlname=$1 "
                        r.query(query, ['INCOMMING'], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rows.length > 0) {
                                    let control = results.rows

                                    r.release()
                                    return res.status(200).json({ data: rs, control: control })
                                } else {
                                    return res.status(201).json({ message: "Stock control has not been initialized. Contact Admin" })
                                }
                            }
                        })
                    } else {

                        r.release();
                        return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})

// 

router.post('/loadPreviousStock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouse_stock_total_quantity,isstockopemend FROM  warehouse_product_stock  WHERE  warehouseproductstckbrand=$1 AND isstockopemend=$2"

            r.query(query, [data.brandID, true], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {

                    if (results.rows.length > 0) {
                        // let istrue=results.rows[0].isstockopemend
                        // console.log('Data rows', istrue)
                        // if(istrue===false){
                        //     return res.status(200).json({closed:'The product item you selected is closed. Use the data Manager section to activate the stock'})
                        // }else{

                        // }
                        console.log(results.rows)
                        return res.status(200).json({ data: results.rows })
                        r.release();

                    } else {
                        r.release();
                        return res.status(201).json({ empty: 'none' })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



// addIncomingStock




router.post('/addIncomingStock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('data', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT * FROM warehouse_product_stock WHERE stocknumber=$1 "

            r.query(query, [data.stockNumber], (error, results) => {

                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.details })
                } else {

                    if (results.length > 0) {
                        console.log('duplicate')
                        return res.status(200).json({ message: 'Duplication stock Id' })
                    } else {

                        query = "SELECT * FROM warehouse_product_stock WHERE warehouseproductstockid=$1 AND productstockcartegory=$2 AND warehouseproductstockproductid=$3 AND  warehouseproductstckbrand=$4"
                        r.query(query, [data.whse_stockid, data.cartegory, data.productid, data.brandid], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {

                                if (results.rows.length > 0) {
                                    query = "UPDATE warehouse_product_stock SET isstockopemend=$1 WHERE warehouseproductstockid=$2 AND productstockcartegory=$3 AND warehouseproductstockproductid=$4 AND  warehouseproductstckbrand=$5"
                                    r.query(query, [false, data.whse_stockid, data.cartegory, data.productid, data.brandid], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(201).json({ message: error.details })
                                        } else {
                                            console.log('old insertion')
                                            query = "INSERT INTO warehouse_product_stock (warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproduct_current_quantity,datedopened,warehouse_stock_new_quantity,Warehouse_Stock_total_quantity,comments,isstockopemend,stocknumber,stock_controlid,quantitycontroled) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)"

                                            r.query(query, [data.whse_stockid, data.cartegory, data.brandid, data.warehouseid, data.productid, data.currentQty, data.datePOsted, data.newQuantity, data.totalQty, data.details, true, data.stockNumber, data.controldId, data.controledQuantity], (error, results) => {
                                                if (error) {
                                                    console.log("The error ", error)
                                                    r.release();
                                                    return res.status(201).json({ message: error.detail })
                                                } else {
                                                    if (results.rowCount > 0) {
                                                        query = 'UPDATE incomingstock SET iscurrent_stock=$1 WHERE  iscurrent_stock=$2 '
                                                        r.query(query, [false, true], (error, results) => {
                                                            if (error) {
                                                                console.log("The error ", error)
                                                                r.release();
                                                                return res.status(201).json({ message: error.detail })
                                                            } else {
                                                                if (results.rowCount > 0) {
                                                                    //   console.log(results)
                                                                    query = 'INSERT INTO incomingstock(stockid, stockoperationid, incomingproductid, invoice_quoteid, incomingquantity, dateposted, iscurrent_stock, incomingdetails, productbrandid)VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                                                                    r.query(query, [data.stockNumber, data.controldId, data.productid, data.SupplierInvoiceNumber, data.newQuantity, data.datePOsted, true, data.details, data.brandid], (error, results) => {
                                                                        if (error) {
                                                                            console.log("The error ", error)
                                                                            r.release();
                                                                            return res.status(201).json({ message: error.detail })
                                                                        } else {
                                                                            if (results.rowCount > 0) {

                                                                                r.release()
                                                                                return res.status(200).json({ success: "Stock successfully added" })
                                                                            } else {
                                                                                r.release();
                                                                                return res.status(201).json({ message: 'An error has occured while processing the request' })
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    query = 'INSERT INTO incomingstock(stockid, stockoperationid, incomingproductid, invoice_quoteid, incomingquantity, dateposted, iscurrent_stock, incomingdetails, productbrandid)VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                                                                    r.query(query, [data.stockNumber, data.controldId, data.productid, data.SupplierInvoiceNumber, data.newQuantity, data.datePOsted, true, data.details, data.brandid], (error, results) => {
                                                                        if (error) {
                                                                            console.log("The error ", error)
                                                                            r.release();
                                                                            return res.status(201).json({ message: error.detail })
                                                                        } else {

                                                                            if (results.rowCount > 0) {

                                                                                r.release()
                                                                                return res.status(200).json({ success: "Stock successfully added" })
                                                                            } else {
                                                                                r.release();
                                                                                return res.status(201).json({ message: 'An error has occured while processing the request' })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        })


                                                    } else {

                                                        r.release();
                                                        return res.status(201).json({ message: 'An internal error has prevented the system from serving your request' })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {

                                    query = "INSERT INTO warehouse_product_stock (warehouseproductstockid, productstockcartegory, warehouseproductstckbrand, warehousenumber, warehouseproductstockproductid, wareshouseproduct_current_quantity, datedopened, warehouse_stock_new_quantity, Warehouse_Stock_total_quantity, comments, isstockopemend, stocknumber, stock_controlid, quantitycontroled) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"

                                    r.query(query, [data.whse_stockid, data.cartegory, data.brandid, data.warehouseid, data.productid, data.currentQty, data.datePOsted, data.newQuantity, data.totalQty, data.details, true, data.stockNumber, data.controldId, data.controledQuantity], (error, results) => {
                                        if (error) {
                                            console.log("The error ", error)
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {
                                            if (results.rowCount > 0) {

                                                query = 'INSERT INTO incomingstock(stockid, stockoperationid, incomingproductid, invoice_quoteid, incomingquantity, dateposted, iscurrent_stock, incomingdetails, productbrandid)VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9)'
                                                r.query(query, [data.stockNumber, data.controldId, data.productid, data.SupplierInvoiceNumber, data.newQuantity, data.datePOsted, true, data.details, data.brandid], (error, results) => {
                                                    if (error) {
                                                        console.log("The error ", error)
                                                        r.release();
                                                        return res.status(201).json({ message: error.detail })
                                                    } else {
                                                        if (results.rowCount > 0) {
                                                            query = 'UPDATE incomingstock SET iscurrent_stock=$1 WHERE  iscurrent_stock=$2 '
                                                            r.query(query, [false, true], (error, results) => {
                                                                if (error) {
                                                                    console.log("The error ", error)
                                                                    r.release();
                                                                    return res.status(201).json({ message: error.detail })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        query = 'INSERT INTO incomingstock(stockid, stockoperationid, incomingproductid, invoice_quoteid, incomingquantity, dateposted, iscurrent_stock, incomingdetails, productbrandid)VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                                                                        r.query(query, [data.stockNumber, data.controldId, data.productid, data.SupplierInvoiceNumber, data.newQuantity, data.datePOsted, true, data.details, data.brandid], (error, results) => {
                                                                            if (error) {
                                                                                console.log("The error ", error)
                                                                                r.release();
                                                                                return res.status(201).json({ message: error.detail })
                                                                            } else {
                                                                                if (results.rowCount > 0) {
                                                                                    r.release()
                                                                                    return res.status(200).json({ success: "Stock successfully added" })
                                                                                } else {
                                                                                    r.release();
                                                                                    return res.status(201).json({ message: 'An error has occured while processing the request' })
                                                                                }
                                                                            }
                                                                        })
                                                                    } else {
                                                                        query = 'INSERT INTO incomingstock(stockid, stockoperationid, incomingproductid, invoice_quoteid, incomingquantity, dateposted, iscurrent_stock, incomingdetails, productbrandid)VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                                                                        r.query(query, [data.stockNumber, data.controldId, data.productid, data.SupplierInvoiceNumber, data.newQuantity, data.datePOsted, true, data.details, data.brandid], (error, results) => {
                                                                            if (error) {
                                                                                console.log("The error ", error)
                                                                                r.release();
                                                                                return res.status(201).json({ message: error.detail })
                                                                            } else {
                                                                                if (results.rowCount > 0) {
                                                                                    r.release()
                                                                                    return res.status(200).json({ success: "Stock successfully added" })
                                                                                } else {
                                                                                    r.release();
                                                                                    return res.status(201).json({ message: 'An error has occured while processing the request' })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })

                                                            // r.release()
                                                            // return res.status(200).json({ success: "Stock successfully added" })
                                                        } else {
                                                            r.release();
                                                            return res.status(201).json({ message: 'An error has occured while processing the request' })
                                                        }
                                                    }
                                                })


                                            } else {

                                                r.release();
                                                return res.status(201).json({ message: 'An internal error has prevented the system from serving your request' })
                                            }
                                        }
                                    })
                                }
                            }
                        })




                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



///Loading stock by categories 
// 



router.post('/loadstockbyBycartegories', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Search Data=>', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT warehouse_product_stock.warehouseproductstockid,warehouse_product_stock.productstockcartegory,warehouse_product_stock.warehouseproductstckbrand,warehouse_product_stock.warehouseproductstockproductid,warehouse_product_stock.wareshouseproduct_current_quantity,warehouse_product_stock.datedopened,warehouse_product_stock.dateclosed,warehouse_product_stock.comments,warehouse_product_stock.isstockopemend,warehouse_product_stock.warehouse_stock_new_quantity,warehouse_product_stock.warehouse_stock_total_quantity,warehouse_product_stock.stocknumber,productbrand.title,productbrand.imageurl,products.name, prodcart.category_name, stockoperation_controls.controlname,warehouse_product_stock.stock_controlid,warehouse_product_stock.quantitycontroled FROM warehouse_product_stock LEFT JOIN productbrand ON warehouse_product_stock.warehouseproductstckbrand=productbrand.brandid LEFT JOIN products ON warehouse_product_stock.warehouseproductstockproductid=products.serialnumber LEFT JOIN prodcart ON warehouse_product_stock.productstockcartegory=prodcart.serialnumber LEFT JOIN stockoperation_controls ON warehouse_product_stock.stock_controlid=stockoperation_controls.controlid WHERE  warehouse_product_stock.productstockcartegory=$1  AND warehouse_product_stock.isstockopemend=$2'
            r.query(query, [data.category, true], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log('The rows+> ', results.rows)
                    if (results.rows.length > 0) {
                        console.log('Data rows', results.rows)
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {

                        r.release();
                        return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



router.post('/loadallStock_for_category', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Search Data=>', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT warehouse_product_stock.warehouseproductstockid,warehouse_product_stock.productstockcartegory,warehouse_product_stock.warehouseproductstckbrand,warehouse_product_stock.warehouseproductstockproductid,warehouse_product_stock.wareshouseproduct_current_quantity,warehouse_product_stock.datedopened,warehouse_product_stock.dateclosed,warehouse_product_stock.comments,warehouse_product_stock.isstockopemend,warehouse_product_stock.warehouse_stock_new_quantity,warehouse_product_stock.warehouse_stock_total_quantity,warehouse_product_stock.stocknumber,productbrand.title,productbrand.imageurl,products.name, prodcart.category_name, stockoperation_controls.controlname,warehouse_product_stock.stock_controlid,warehouse_product_stock.quantitycontroled FROM warehouse_product_stock LEFT JOIN productbrand ON warehouse_product_stock.warehouseproductstckbrand=productbrand.brandid LEFT JOIN products ON warehouse_product_stock.warehouseproductstockproductid=products.serialnumber LEFT JOIN prodcart ON warehouse_product_stock.productstockcartegory=prodcart.serialnumber LEFT JOIN stockoperation_controls ON warehouse_product_stock.stock_controlid=stockoperation_controls.controlid WHERE  warehouse_product_stock.productstockcartegory=$1'
            r.query(query, [data.category], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log('The rows+> ', results.rows)
                    if (results.rows.length > 0) {
                        console.log('Data rows', results.rows)
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {

                        r.release();
                        return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})










router.post('/loadstockHistory', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Search Data=>', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT warehouse_product_stock.warehouseproductstockid,warehouse_product_stock.productstockcartegory,warehouse_product_stock.warehouseproductstckbrand,warehouse_product_stock.warehouseproductstockproductid,warehouse_product_stock.wareshouseproduct_current_quantity,warehouse_product_stock.datedopened,warehouse_product_stock.dateclosed,warehouse_product_stock.comments,warehouse_product_stock.isstockopemend,warehouse_product_stock.warehouse_stock_new_quantity,warehouse_product_stock.warehouse_stock_total_quantity,warehouse_product_stock.stocknumber,productbrand.title,productbrand.imageurl,products.name, prodcart.category_name, stockoperation_controls.controlname,warehouse_product_stock.stock_controlid,warehouse_product_stock.quantitycontroled FROM warehouse_product_stock LEFT JOIN productbrand ON warehouse_product_stock.warehouseproductstckbrand=productbrand.brandid LEFT JOIN products ON warehouse_product_stock.warehouseproductstockproductid=products.serialnumber LEFT JOIN prodcart ON warehouse_product_stock.productstockcartegory=prodcart.serialnumber LEFT JOIN stockoperation_controls ON warehouse_product_stock.stock_controlid=stockoperation_controls.controlid WHERE warehouse_product_stock.productstockcartegory=$1'
            r.query(query, [data.category], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log(results.rows)
                    if (results.rows.length > 0) {
                        console.log('Data rows', results.rows)
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {

                        r.release();
                        return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



router.post('/createControl', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT controlname FROM stockoperation_controls WHERE controlname=$1"
            r.query(query, [data.control], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ message: 'Control has already been initialised' })
                    } else {
                        query = 'INSERT INTO stockoperation_controls(controlid,controlname,dateposted,details,status)VALUES($1,$2,$3,$4,$5)'
                        r.query(query, [data.id, data.control, data.date, 'none', data.Auth], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release();
                                    return res.status(200).json({ success: 'Control successfully created' })
                                } else {
                                    r.release();
                                    return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                                }
                            }
                        })


                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})

router.get('/loadControls', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT controlid,controlname,dateposted,details,status FROM stockoperation_controls"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {

                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



// Transfering to store code 




router.post('/tostoretransfer', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT products.serialnumber,products.name,products.category,productbrand.brandid,productbrand.title  FROM products LEFT JOIN productbrand ON products.serialnumber=productbrand.productid WHERE  productbrand.productid=$1'

            r.query(query, [data.stockId], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })

                    } else {

                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.get('/loadstockcontrol', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT controlid,controlname,dateposted,details,status FROM stockoperation_controls WHERE controlname=$1 "
            r.query(query, ['TO_STORE_TRANSFER'], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('Controls,', results.rows)
                        r.release()
                        return res.status(200).json({ control: results.rows })
                    } else {
                        return res.status(201).json({ message: "Stock control has not been initialized. Contact Admin" })
                    }
                }
            })
        } else {

            r.release();
            return res.status(201).json({ message: "Database connectivity has tarminated. Check your internet connection" })
        }

    })
})







router.get('/loadstores', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT storenumber,storename,storetype,storelacation,digitaladdress,storedescription,dateposted,isstoreopened FROM stores"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        return res.status(201).json({ message: "No Store records available" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})

// loadwarehouses


router.get('/loadwarehouses', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT whse_serialnumber,warehousename,location,digitaladdress,decription,date,isopened FROM warehouse"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        return res.status(201).json({ message: "No Store records available" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})




router.post('/transfertostores', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT stock_to_storeid FROM warehous_to_stores WHERE stock_to_storeid=$1"
            r.query(query, [data.stockwidthdrawalID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ message: 'Control has already been initialised' })
                    } else {
                        query = 'INSERT INTO warehous_to_stores(stock_to_storeid, stockoperationid, from_warehouse_id,Store_id, withdrawn_productid, store_request_id ,drawal_quantity ,date_withdrawn, drawal_details, isDrawn_stock_moved, warehouse_stock_id,withdrwanbrand)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                        r.query(query, [data.stockwidthdrawalID, data.controlObject, data.warehouseNumber, data.storeid, data.stockedSelectedProduct, data.storequestID, data.quantityWithdraw, new Date(), data.drawaldetails, false, data.whse_stockid, data.brandid], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release();

                                    return res.status(200).json({ success: 'Control successfully created' })
                                } else {
                                    r.release();
                                    return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                                }
                            }
                        })


                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})
// loadInitialRequest

router.post('/loadInitialRequest', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT warehous_to_stores.stock_to_storeid, warehous_to_stores.stockoperationid, warehous_to_stores.from_warehouse_id, warehous_to_stores.store_request_id, " +
                " warehous_to_stores.store_id, warehous_to_stores.withdrawn_productid, warehous_to_stores.store_request_id, warehous_to_stores.drawal_quantity," +
                " warehous_to_stores.date_withdrawn, warehous_to_stores.drawal_details, warehous_to_stores.isdrawn_stock_moved, warehous_to_stores.warehouse_stock_id, " +
                "warehous_to_stores.withdrwanbrand, warehouse.warehousename,stockoperation_controls.controlname,products.name, productbrand.title," +
                " stores.storename FROM warehous_to_stores LEFT JOIN warehouse ON warehous_to_stores.from_warehouse_id=warehouse.whse_serialnumber " +
                "LEFT JOIN stockoperation_controls ON  warehous_to_stores.stockoperationid=stockoperation_controls.controlid LEFT JOIN " +
                "products ON warehous_to_stores.withdrawn_productid=products.serialnumber LEFT JOIN productbrand ON warehous_to_stores.withdrwanbrand=productbrand.brandid LEFT JOIN stores ON warehous_to_stores.store_id=stores.storenumber " +
                " WHERE store_request_id=$1"
            r.query(query, [data.RequestNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log(results.rows)
                        r.release();

                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release();
                        return res.status(201).json({ message: "Results not found" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Database connection failed" })
        }
    })
})





// loadWarehouseRequest







// approveRequest


router.post('/approveRequest', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('let data=> ', data)
    await pool.connect().then(async (r) => {
        r.query('BEGIN')
        if (r._connected) {
            query = 'SELECT warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproduct_current_quantity,datedopened,dateclosed,comments,isstockopemend,warehouse_stock_new_quantity,warehouse_stock_total_quantity,stocknumber,stock_controlid,quantitycontroled FROM warehouse_product_stock WHERE warehouseproductstckbrand=$1 AND isstockopemend=$2 AND warehouseproductstockid=$3'
            r.query(query, [data.withdrwanbrand, data.isApprove, data.warehouse_stock_id], (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        let = resultsData = results.rows
                        const amountToTransfer = data.drawal_quantity
                        const TotalStock = resultsData[0].warehouse_stock_total_quantity
                        const RemainingStock = TotalStock - amountToTransfer
                        console.log('The remaining Stock', RemainingStock)
                        resultsData[0].warehouse_stock_total_quantity = RemainingStock
                        resultsData[0].quantitycontroled = amountToTransfer
                        console.log('tHE FOUND ROWS', resultsData)
                        //                         const crypto = require('crypto');
                        // const num = crypto.randomInt(1, 11);
                        query = 'UPDATE warehouse_product_stock SET isstockopemend=$1 WHERE warehouseproductstckbrand=$2 AND isstockopemend=$3 AND warehouseproductstockid=$4'
                        r.query(query, [false, data.withdrwanbrand, true, data.warehouse_stock_id], (error, results) => {
                            if (error) {
                                console.log(error)
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = 'INSERT INTO warehouse_product_stock(warehouseproductstockid, productstockcartegory, warehouseproductstckbrand, warehousenumber, warehouseproductstockproductid, wareshouseproduct_current_quantity, datedopened, dateclosed, comments, isstockopemend, warehouse_stock_new_quantity, warehouse_stock_total_quantity, stocknumber, stock_controlid, quantitycontroled)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) '
                                    r.query(query, [resultsData[0].warehouseproductstockid, resultsData[0].productstockcartegory, resultsData[0].warehouseproductstckbrand, resultsData[0].warehousenumber, resultsData[0].warehouseproductstockproductid,resultsData[0].warehouse_stock_total_quantity, new Date(), new Date(), resultsData[0].comments, data.isApprove, 0, resultsData[0].warehouse_stock_total_quantity, data.stock_to_storeid, resultsData[0].stock_controlid, resultsData[0].quantitycontroled], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                query = 'UPDATE warehous_to_stores SET isdrawn_stock_moved=$1 WHERE stock_to_storeid=$2 AND store_request_id=$3 AND isdrawn_stock_moved=$4 AND withdrwanbrand=$5 AND store_id=$6 AND from_warehouse_id=$7 AND stockoperationid=$8'
                                                r.query(query, [data.isApprove, data.stock_to_storeid, data.store_request_id, false, data.withdrwanbrand, data.store_id, data.from_warehouse_id, data.stockoperationid], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error })
                                                    } else {
                                                        if (results.rowCount > 0) {
                                                            query = 'INSERT INTO store_received_stock(stock_to_storeid, stockoperationid, from_warehouse_id, store_id, received_productid, store_request_id, quantity_requested,quantity_received, date_received, received_details, approve_receipt, warehouse_stock_id, received_brand)VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'
                                                            r.query(query, [data.stock_to_storeid, data.stockoperationid, resultsData[0].warehousenumber,data.store_id, resultsData[0].warehouseproductstockproductid,data.store_request_id, 0,data.drawal_quantity,new Date(),resultsData[0].comments,false,data.warehouse_stock_id,data.withdrwanbrand], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.query('COMMIT')
                                                                        return res.status(200).json({ success: 'Approval Successful' })
                                                                    } else {
                                                                        console.log("AN ERROR HAS OCCURED")
                                                                        r.query('ROLLBACK')
                                                                        r.release()
                                                                        return res.status(201).json({ messafe: 'An error occured while updating the store receved request' })
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            r.query('ROLLBACK')
                                                            r.release()
                                                            return res.status(201).json({ message: "Request was unssessful" })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(201).json({ message: "An error has prevented your request being approved" })
                                            }
                                        }
                                    })
                                } else {
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(201).json({ message: "An error occured! Update could not be performed on warehouse stock" })
                                }
                            }
                        })


                    } else {
                        console.log('records not found')
                        return res.status(201).json({ message: "The requested records could not be found" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "unable to connect to the database" })
        }
    })
})
// 


router.get('/loadstockcontrolforwarehouse', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT controlid,controlname,dateposted,details,status FROM stockoperation_controls WHERE controlname=$1 "
            r.query(query, ['TRANSFER_TO_WAREHOUSE'], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('Controls,', results.rows)
                        r.release()
                        return res.status(200).json({ control: results.rows })
                    } else {
                        return res.status(201).json({ message: "Stock control has not been initialized. Contact Admin" })
                    }
                }
            })
        } else {

            r.release();
            return res.status(201).json({ message: "Database connectivity has tarminated. Check your internet connection" })
        }

    })
})




// 
// Transfering stock between warehouses

router.post('/transfer_to_Warehouse', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT warehouse_transfer_id FROM warehous_to_warehouse WHERE warehouse_transfer_id=$1"
            r.query(query, [data.stockwidthdrawalID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ message: 'Control has already been initialised' })
                    } else {
                        query = 'INSERT INTO warehous_to_warehouse(warehouse_transfer_id, stockoperationid, from_warehouse_id,transfer_id, transfered_product_id, warehouse_request_id ,transfered_quantity ,date_transfered, transfered_details, is_transfered_stock_moved, warehouse_stock_id, transfered_stock_brand,to_warehouse_id)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'
                        r.query(query, [data.stockwidthdrawalID, data.controlObject, data.warehouseNumber, data.transferid, data.stockedSelectedProduct, data.storequestID, data.quantityWithdraw, new Date(), data.drawaldetails, false, data.whse_stockid, data.brandid,data.towarehouse], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release();

                                    return res.status(200).json({ success: 'Control successfully created' })
                                } else {
                                    r.release();
                                    return res.status(201).json({ message: "Internal error has prevented the system from fulfilling your request" })
                                }
                            }
                        })


                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


// Loading warehouse transfer request
// ===============================================================================================================================================================================
// ===============================================================================================================================================================================

router.post('/loadWarehouseRequest', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT warehous_to_warehouse.warehouse_transfer_id, warehous_to_warehouse.stockoperationid, warehous_to_warehouse.from_warehouse_id, warehous_to_warehouse.warehouse_request_id, " +
                " warehous_to_warehouse.to_warehouse_id, warehous_to_warehouse.transfered_product_id, warehous_to_warehouse.warehouse_request_id, warehous_to_warehouse.transfered_quantity," +
                " warehous_to_warehouse.date_transfered,warehous_to_warehouse.transfer_id, warehous_to_warehouse.transfered_details, warehous_to_warehouse.is_transfered_stock_moved, warehous_to_warehouse.warehouse_stock_id, " +
                "warehous_to_warehouse.transfered_stock_brand, warehouse.warehousename AS to_warehouse_name,stockoperation_controls.controlname,products.name, productbrand.title " +
                " FROM warehous_to_warehouse LEFT JOIN warehouse ON warehous_to_warehouse.to_warehouse_id=warehouse.whse_serialnumber " +
                "LEFT JOIN stockoperation_controls ON  warehous_to_warehouse.stockoperationid=stockoperation_controls.controlid LEFT JOIN " +
                "products ON warehous_to_warehouse.transfered_product_id=products.serialnumber LEFT JOIN productbrand ON warehous_to_warehouse.transfered_stock_brand=productbrand.brandid " +
                "  WHERE warehous_to_warehouse.warehouse_request_id=$1 OR warehous_to_warehouse.transfer_id=$2"
            r.query(query, [data.RequestNumber,data.RequestNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('Request request data',results.rows)
                        r.release();

                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release();
                        return res.status(201).json({ message: "Results not found" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "Database connection failed" })
        }
    })
})







router.post('/warehouseRequeastapproval', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('let data=> ', data)
    await pool.connect().then(async (r) => {
        r.query('BEGIN')
        if (r._connected) {
            query = 'SELECT warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproduct_current_quantity,datedopened,dateclosed,comments,isstockopemend,warehouse_stock_new_quantity,warehouse_stock_total_quantity,stocknumber,stock_controlid,quantitycontroled'+
            ' FROM warehouse_product_stock WHERE warehouseproductstckbrand=$1 AND isstockopemend=$2 AND warehouseproductstockid=$3'
            r.query(query, [data.transfered_stock_brand, data.isApprove, data.warehouse_stock_id], (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                         
                        let = resultsData = results.rows
                        const amountToTransfer = data.transfered_quantity
                        const TotalStock = resultsData[0].warehouse_stock_total_quantity
                        const RemainingStock = TotalStock - amountToTransfer
                        console.log('The remaining Stock', RemainingStock)
                        resultsData[0].warehouse_stock_total_quantity = RemainingStock
                        resultsData[0].quantitycontroled = amountToTransfer
                       console.log('tHE FOUND ROWS', resultsData)
                        //                         const crypto = require('crypto');
                        // const num = crypto.randomInt(1, 11);
                        query = 'UPDATE warehouse_product_stock SET isstockopemend=$1 WHERE warehouseproductstckbrand=$2 AND isstockopemend=$3 AND warehouseproductstockid=$4'
                        r.query(query, [false, data.transfered_stock_brand, true, data.warehouse_stock_id], (error, results) => {
                            if (error) {
                                console.log(error)
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = 'INSERT INTO warehouse_product_stock(warehouseproductstockid, productstockcartegory, warehouseproductstckbrand, warehousenumber, warehouseproductstockproductid, wareshouseproduct_current_quantity, datedopened, dateclosed, comments, isstockopemend, warehouse_stock_new_quantity, warehouse_stock_total_quantity, stocknumber, stock_controlid, quantitycontroled)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) '
                                    r.query(query, [resultsData[0].warehouseproductstockid, resultsData[0].productstockcartegory, resultsData[0].warehouseproductstckbrand, resultsData[0].warehousenumber, resultsData[0].warehouseproductstockproductid,resultsData[0].warehouse_stock_total_quantity , new Date(), new Date(), resultsData[0].comments, data.isApprove, 0, resultsData[0].warehouse_stock_total_quantity, data.to_warehouse_id, resultsData[0].stock_controlid, resultsData[0].quantitycontroled], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                query = 'UPDATE warehous_to_warehouse SET is_transfered_stock_moved=$1 WHERE warehouse_transfer_id=$2 AND warehouse_request_id=$3 AND is_transfered_stock_moved=$4 AND transfered_stock_brand=$5 AND to_warehouse_id=$6 AND from_warehouse_id=$7 AND stockoperationid=$8'
                                                r.query(query, [data.isApprove, data.warehouse_transfer_id, data.warehouse_request_id, false, data.transfered_stock_brand, data.to_warehouse_id, data.from_warehouse_id, data.stockoperationid], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error })
                                                    } else {
                                                        if (results.rowCount > 0) {
                                                            query = 'INSERT INTO warehous_received_stock(stock_to_warehouse_id,warehouse_transfer_id, stockoperationid, from_warehouse_id, to_warehouse_id, received_productid, warehouse_request_id, quantity_requested,quantity_received, date_received, received_details, approve_receipt, warehouse_stock_id, received_brand)VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)'
                                                            r.query(query, [data.warehouse_transfer_id, data.warehouse_transfer_id, data.stockoperationid, resultsData[0].warehousenumber, data.to_warehouse_id, resultsData[0].warehouseproductstockproductid, data.warehouse_request_id, data.transfered_quantity, data.transfered_quantity,new Date(),resultsData[0].comments,false,data.warehouse_stock_id, data.stockoperationid], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.query('COMMIT')
                                                                        return res.status(200).json({ success: 'Approval Successful' })
                                                                    } else {
                                                                        console.log("AN ERROR HAS OCCURED")
                                                                        r.query('ROLLBACK')
                                                                        r.release()
                                                                        return res.status(201).json({ messafe: 'An error occured while updating the store receved request' })
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            r.query('ROLLBACK')
                                                            r.release()
                                                            return res.status(201).json({ message: "Request was unssessful" })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(201).json({ message: "An error has prevented your request being approved" })
                                            }
                                        }
                                    })
                                } else {
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(201).json({ message: "An error occured! Update could not be performed on warehouse stock" })
                                }
                            }
                        })

                    } else {
                        console.log('records not found')
                        return res.status(201).json({ message: "The requested records could not be found" })
                    }
                }
            })
        } else {
            return res.status(201).json({ message: "unable to connect to the database" })
        }
    })
})
// 

// Loading all controls

router.get('/returnstockcontrols', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT controlid, controlname, dateposted, details, status FROM stockoperation_controls WHERE controlname LIKE '%RETURN%'"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('Controls,', results.rows)
                        r.release()
                        return res.status(200).json({ control: results.rows })
                    } else {
                        return res.status(201).json({ message: "Stock control has not been initialized. Contact Admin" })
                    }
                }
            })
        } else {

            r.release();
            return res.status(201).json({ message: "Database connectivity has tarminated. Check your internet connection" })
        }

    })
})

// loadStoreProduct

router.post('/loadStoreProduct_for_selected_store', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = "SELECT warehouseproductstockid, productstockcartegory, warehouseproductstckbrand, warehousenumber, warehouseproductstockproductid, FROM stockoperation_controls WHERE controlname LIKE '%RETURN%'"
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {

                }
            
            })
        }
        })
    })

module.exports = router