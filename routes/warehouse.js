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
                        query = 'SELECT  warehousestock.cartegory,warehousestock.warehouseid,warehousestock.productid, warehousestock.whse_stockid,warehousestock.identityid,products.name,warehousestock.dateopened,warehousestock.dateclosed,warehousestock.details,warehousestock.isopened,prodcart.category_name FROM warehousestock' +
                            ' LEFT JOIN prodcart ON warehousestock.cartegory=prodcart.serialnumber LEFT JOIN products ON  warehousestock.productid=products.serialnumber WHERE warehousestock.warehouseid=$1'
                        r.query(query, [data.selectedWarehouseoperationID], (error, results) => {
                            if (error) {
                                r.release();
                                console.log(error)
                                return res.status(201).json({ message: error.sqlMessage })
                            } else {
                                if (results.rows.length > 0) {
                                    console.log(results.rows)
                                    res.status(200).json({ data: results.rows })
                                } else {
                                    console.log("Data not found")
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
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        const products = results.rows
                        return res.status(200).json({ Product: products })
                    } else {

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

//drooping waregouse stock




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
                        r.query(query,['INCOMMING'], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rows.length > 0) {
                                    let control = results.rows
                                    console.log(control)
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

            query = "SELECT warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouse_stock_total_quantity,isstockopemend FROM  warehouse_product_stock  WHERE  warehouseproductstckbrand=$1"

            r.query(query, [data.brandID], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log('foind ', results.rows)
                    if (results.rows.length > 0) {
                        // let istrue=results.rows[0].isstockopemend
                        // console.log('Data rows', istrue)
                        // if(istrue===false){
                        //     return res.status(200).json({closed:'The product item you selected is closed. Use the data Manager section to activate the stock'})
                        // }else{

                        // }
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
                                console.log(results.rows)
                                if (results.rows.length > 0) {
                                    query = "UPDATE warehouse_product_stock SET isstockopemend=$1 WHERE warehouseproductstockid=$2 AND productstockcartegory=$3 AND warehouseproductstockproductid=$4 AND  warehouseproductstckbrand=$5"
                                    r.query(query, [false, data.whse_stockid, data.cartegory, data.productid, data.brandid], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(201).json({ message: error.details })
                                        } else {
                                            query = "INSERT INTO warehouse_product_stock (warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproduct_current_quantity,datedopened,warehouse_stock_new_quantity,Warehouse_Stock_total_quantity,comments,isstockopemend,stocknumber,stock_controlid,quantitycontroled) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)"

                                            r.query(query, [data.whse_stockid, data.cartegory, data.brandid, data.warehouseid, data.productid, data.currentQty, data.datePOsted, data.newQuantity, data.totalQty, data.details, true, data.stockNumber,controldId,controledQuantity], (error, results) => {
                                                if (error) {
                                                    console.log("The error ", error)
                                                    r.release();
                                                    return res.status(201).json({ message: error.detail })
                                                } else {
                                                    if (results.rowCount > 0) {
                                                        r.release();
                                                        return res.status(200).json({ success: "Stock successfully added" })
                                                    } else {

                                                        r.release();
                                                        return res.status(201).json({ message: 'An internal error has prevented the system from serving your request' })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    query = "INSERT INTO warehouse_product_stock (warehouseproductstockid,productstockcartegory,warehouseproductstckbrand,warehousenumber,warehouseproductstockproductid,wareshouseproduct_current_quantity,datedopened,warehouse_stock_new_quantity,Warehouse_Stock_total_quantity,comments,isstockopemend,stocknumber,stock_controlid,quantitycontroled) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,14)"

                                    r.query(query, [data.whse_stockid, data.cartegory, data.brandid, data.warehouseid, data.productid, data.currentQty, data.datePOsted, data.newQuantity, data.totalQty, data.details, true, data.stockNumber,controldId,controledQuantity], (error, results) => {
                                        if (error) {
                                            console.log("The error ", error)
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {
                                            if (results.rowCount > 0) {
                                                r.release();
                                                return res.status(200).json({ success: "Stock successfully added" })
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



module.exports = router