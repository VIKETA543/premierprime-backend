const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')






// addidentity

router.post('/addStoretype', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "INSERT INTO storetype(storeIdentityid,storeIdentityname,storeidenetitydesc,dateposeted,authstore)VALUES($1,$2,$3,$4,$5)"
            r.query(query, [data.storeIdentityID, data.storeIdentityName, data.storeidenetityDesc, data.dateposeted, false], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(400).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: "Store type successfully created" })
                    } else {
                        r.release()
                        return res.status(200).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})




router.get('/listallStores', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT stores.storenumber,stores.storename,stores.storetype,stores.storelacation,stores.digitaladdress,stores.storedescription,stores.dateposted,stores.isstoreopened,storetype.storeidentityname FROM stores LEFT JOIN storetype ON stores.storetype=storetype.storeidentityid"
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
                        r.release()
                        return res.status(200).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})




router.get('/liststoretypes', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT storeIdentityid,storeIdentityname,storeidenetitydesc,dateposeted,authstore FROM storetype"
            r.query(query, (error, results) => {
                if (error) {

                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {
                        console.log("The error ", error)
                        r.release();
                        return res.status(201).json({ message: 'No records available' })
                    }
                }
            })

        }
    })
})



router.post('/savestore', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "INSERT INTO stores(storenumber,storename,storetype,storelacation,digitaladdress,storedescription,dateposted,isstoreopened)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
            r.query(query, [data.storeNumber, data.StoreName, data.selectedStoreType, data.StoreLocation, data.storeDigitalAddress, data.storeDescription, data.date, false], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        r.release();
                        return res.status(200).json({ success: "Store type successfully created" })
                    } else {
                        r.release()
                        return res.status(201).json({ message: "Internal error has occured. Try again" })
                    }
                }
            })

        }
    })
})




router.post('/receive_stock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = "SELECT store_received_stock.stock_to_storeid, store_received_stock.stockoperationid, productbrand.imageurl, " +
                " store_received_stock.from_warehouse_id, warehouse.warehousename, store_received_stock.store_id," +
                " store_received_stock.received_productid, products.name, store_received_stock.store_request_id, " +
                " store_received_stock.quantity_requested, store_received_stock.date_received, store_received_stock.received_details," +
                " store_received_stock.approve_receipt, store_received_stock.warehouse_stock_id, store_received_stock.received_brand, " +
                " productbrand.title, store_received_stock.quantity_received FROM store_received_stock LEFT JOIN warehouse " +
                "  ON store_received_stock.from_warehouse_id=warehouse.whse_serialnumber LEFT JOIN productbrand ON " +
                " store_received_stock.received_brand=productbrand.brandid LEFT JOIN products ON store_received_stock.received_productid=products.serialnumber " +
                " WHERE store_received_stock.store_id=$1 AND store_received_stock.approve_receipt=$2"
            r.query(query, [data.storeNumber, false], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release()
                        return res.status(201).json({ Norecords: "This store has no received stock" })
                    }
                }
            })

        }
    })
})

router.post('/poststocksummeries', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    var oldqty = 0
    var newQty = 0
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            BEGIN;
            query = 'SELECT stock_number,product_category FROM store_products WHERE product_number=$1'
            r.query(query, [data.product_number.trim()], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error })
                } else {
                    console.log('The store number', results.rows)
                    if (results.rows.length > 0) {
                        let stock_number = results.rows[0].stock_number
                        let product_category = results.rows[0].product_category

                        query = 'SELECT store_id, store_product_stock_id,store_product_category,store_products_brand_id,store_product_current_quantity,datedopened,dateclosed,comments,isstockopemend,store_product_stock_new_quantity,store_product_total_quantity, store_product_number FROM store_products_stock WHERE store_product_stock_id=$1 AND store_product_category=$2  AND store_products_brand_id=$3 AND store_product_number=$4'
                        r.query(query, [stock_number, product_category, data.stock_brandd, data.product_number], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                console.log('error message')
                                return res.status(201).json({ message: error })
                            } else {

                                if (results.rows.length > 0) {


                                    oldqty = results.rows[0].store_product_total_quantity
                                    newQty = data.new_quantity + oldqty
                                    query = 'UPDATE store_products_stock  SET isstockopemend=$1 AND dateclosed=$2 WHERE  store_product_stock_id=$3 AND store_product_category=$4  AND store_products_brand_id=$5 AND store_product_number=$6'
                                    r.query(query, [false, new Date(), stock_number, product_category, data.stock_brandd, data.product_number], (error, results) => {
                                        if (error) {
                                            console.log("The error ", error)
                                            r.release();
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                query = 'INSERT INTO store_products_stock(store_id, store_product_stock_id, store_product_category, store_products_brand_id, store_product_current_quantity, datedopened, isstockopemend, store_product_stock_new_quantity, store_product_total_quantity, store_product_number)' +
                                                    '  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
                                                r.query(query, [data.store_id, stock_number, product_category, data.stock_brandd, oldqty, data.date_opened, true, data.new_quantity, newQty, data.product_number], (error, results) => {
                                                    if (error) {
                                                        console.log("The error ", error)
                                                        r.release();
                                                        return res.status(201).json({ message: error.detail })
                                                    } else {

                                                        query = "SELECT store_id,product_number,previous_quantity,transation_date,transaction_details,is_stock_opened,stock_brand,new_quantity,total_quantity,date_opened,date_closed,next_opening" +
                                                            " FROM  rretail_stock_summeries WHERE  is_stock_opened=$1 AND store_id=$2 AND product_number=$3 AND stock_brand=$4"

                                                        r.query(query, [true, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                            if (error) {
                                                                console.log("The error ", error)
                                                                r.release();
                                                                return res.status(201).json({ message: error.detail })
                                                            } else {

                                                                if (results.rows.length > 0) {

                                                                    let rws = results.rows
                                                                    let prevqty = 0
                                                                    let totalQty = 0

                                                                    for (let i = 0; i < rws.length; i++) {


                                                                        prevqty = rws[i].total_quantity
                                                                        console.log('the results for rws', prevqty)
                                                                        totalQty = prevqty + data.new_quantity
                                                                        rws.total_quantity = totalQty
                                                                    }
                                                                    query = 'UPDATE rretail_stock_summeries SET is_stock_opened=$1 WHERE store_id=$2 AND product_number=$3 AND stock_brand=$4'
                                                                    r.query(query, [false, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                                        if (error) {
                                                                            console.log("The error ", error)
                                                                            r.release();
                                                                            return res.status(201).json({ message: error.detail })
                                                                        } else {

                                                                            query = "INSERT INTO rretail_stock_summeries(store_id, product_number, previous_quantity, transation_date, transaction_details, is_stock_opened, stock_brand, new_quantity, total_quantity, date_opened)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                                                                            r.query(query, [data.store_id, data.product_number, prevqty, data.transation_date, data.transaction_details, data.is_stock_opened, data.stock_brandd, data.new_quantity, rws.total_quantity, new Date()], (error, results) => {
                                                                                if (error) {
                                                                                    console.log("The error ", error)
                                                                                    r.release();
                                                                                    return res.status(201).json({ message: error.detail })
                                                                                } else {

                                                                                    query = 'UPDATE store_received_stock SET approve_receipt=$1 WHERE store_id=$2 AND  received_brand=$3 AND received_productid=$4 '
                                                                                    r.query(query, [true, data.store_id, data.stock_brandd, data.product_number], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log("The error ", error)
                                                                                            r.release();
                                                                                            return res.status(201).json({ message: error.detail })
                                                                                        } else {
                                                                                            if (results.rowCount > 0) {
                                                                                                r.release();
                                                                                                COMMIT
                                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                                            } else {
                                                                                                  r.release();
                                                                                                  ROLLBACK;
                                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                                            }
                                                                                        }
                                                                                    })

                                                                                }
                                                                            })
                                                                        }
                                                                    })

                                                                } else {

                                                                    query = "INSERT INTO rretail_stock_summeries(store_id, product_number, previous_quantity, transation_date, transaction_details, is_stock_opened, stock_brand, new_quantity, total_quantity, date_opened)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                                                                    r.query(query, [data.store_id, data.product_number, 0, data.transation_date, data.transaction_details, data.is_stock_opened, data.stock_brandd, data.new_quantity, data.new_quantity, new Date()], (error, results) => {
                                                                        if (error) {
                                                                            console.log("The error ", error)
                                                                            r.release();
                                                                            return res.status(201).json({ message: error.detail })
                                                                        } else {
                                                                            if (results.rowCount > 0) {
                                                                                      query = 'UPDATE store_received_stock SET approve_receipt=$1 WHERE store_id=$2 AND  received_brand=$3 AND received_productid=$4 '
                                                                                    r.query(query, [true, data.store_id, data.stock_brandd, data.product_number], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log("The error ", error)
                                                                                            r.release();
                                                                                            return res.status(201).json({ message: error.detail })
                                                                                        } else {
                                                                                            if (results.rowCount > 0) {
                                                                                                r.release();
                                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                                            } else {
                                                                                                  r.release();
                                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                return res.status(201).json({ message: 'Something went wrong. Request could not be completed' })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        })





                                                    }
                                                })
                                            } else {
                                                r.release();
                                                return res.status(201).json({ message: 'Stock update failed' })
                                            }
                                        }
                                    })

                                } else {

                                    query = 'INSERT INTO store_products_stock(store_id, store_product_stock_id, store_product_category, store_products_brand_id, store_product_current_quantity, datedopened, isstockopemend, store_product_stock_new_quantity, store_product_total_quantity, store_product_number)' +
                                        '  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
                                    r.query(query, [data.store_id, stock_number, product_category, data.stock_brandd, oldqty, data.date_opened, true, data.new_quantity, data.new_quantity, data.product_number], (error, results) => {
                                        if (error) {
                                            console.log("The error ", error)
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {


                                            query = "SELECT store_id,product_number,previous_quantity,transation_date,transaction_details,is_stock_opened,stock_brand,new_quantity,total_quantity,date_opened,date_closed,next_opening" +
                                                " FROM  rretail_stock_summeries WHERE  is_stock_opened=$1 AND store_id=$2 AND product_number=$3 AND stock_brand=$4"

                                            r.query(query, [true, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                if (error) {
                                                    console.log("The error ", error)
                                                    r.release();
                                                    return res.status(201).json({ message: error.detail })
                                                } else {

                                                    if (results.rows.length > 0) {

                                                        let rws = results.rows
                                                        let prevqty = 0
                                                        let totalQty = 0

                                                        for (let i = 0; i < rws.length; i++) {


                                                            prevqty = rws[i].total_quantity
                                                            console.log('the results for rws', prevqty)
                                                            totalQty = prevqty + data.new_quantity
                                                            rws.total_quantity = totalQty
                                                        }
                                                        query = 'UPDATE rretail_stock_summeries SET is_stock_opened=$1 WHERE store_id=$2 AND product_number=$3 AND stock_brand=$4'
                                                        r.query(query, [false, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                            if (error) {
                                                                console.log("The error ", error)
                                                                r.release();
                                                                return res.status(201).json({ message: error.detail })
                                                            } else {

                                                                query = "INSERT INTO rretail_stock_summeries(store_id, product_number, previous_quantity, transation_date, transaction_details, is_stock_opened, stock_brand, new_quantity, total_quantity, date_opened)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                                                                r.query(query, [data.store_id, data.product_number, prevqty, data.transation_date, data.transaction_details, data.is_stock_opened, data.stock_brandd, data.new_quantity, rws.total_quantity, new Date()], (error, results) => {
                                                                    if (error) {
                                                                        console.log("The error ", error)
                                                                        r.release();
                                                                        return res.status(201).json({ message: error.detail })
                                                                    } else {
                                                                               query = 'UPDATE store_received_stock SET approve_receipt=$1 WHERE store_id=$2 AND  received_brand=$3 AND received_productid=$4 '
                                                                                    r.query(query, [true, data.store_id, data.stock_brandd, data.product_number], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log("The error ", error)
                                                                                            r.release();
                                                                                            return res.status(201).json({ message: error.detail })
                                                                                        } else {
                                                                                            if (results.rowCount > 0) {
                                                                                                r.release();
                                                                                                COMMIT
                                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                                            } else {
                                                                                                  r.release();
                                                                                                  ROLLBACK;
                                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                    }
                                                                })
                                                            }
                                                        })

                                                    } else {

                                                        query = "INSERT INTO rretail_stock_summeries(store_id, product_number, previous_quantity, transation_date, transaction_details, is_stock_opened, stock_brand, new_quantity, total_quantity, date_opened)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                                                        r.query(query, [data.store_id, data.product_number, 0, data.transation_date, data.transaction_details, data.is_stock_opened, data.stock_brandd, data.new_quantity, data.new_quantity, new Date()], (error, results) => {
                                                            if (error) {
                                                                console.log("The error ", error)
                                                                r.release();
                                                                return res.status(201).json({ message: error.detail })
                                                            } else {
                                                                if (results.rowCount > 0) {
                                                                           query = 'UPDATE store_received_stock SET approve_receipt=$1 WHERE store_id=$2 AND  received_brand=$3 AND received_productid=$4 '
                                                                                    r.query(query, [true, data.store_id, data.stock_brandd, data.product_number], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log("The error ", error)
                                                                                            r.release();
                                                                                            return res.status(201).json({ message: error.detail })
                                                                                        } else {
                                                                                            if (results.rowCount > 0) {
                                                                                                r.release();
                                                                                                COMMIT
                                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                                            } else {
                                                                                                  r.release();
                                                                                                  ROLLBACK;
                                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                } else {
                                                                    return res.status(201).json({ message: 'Something went wrong. Request could not be completed' })
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            })




                                        }
                                    })

                                }
                            }
                        })
                    } else {

                        return res.status(201).json({ success: "The Selected prodict does not belong to this store" })
                    }
                }

            })


        }
    })
})




//drooping waregouse stock



router.post('/pushProductToStore', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
        BEGIN;
            query = 'SELECT product_number FROM store_products WHERE product_number=$1'
            r.query(query, [data.productid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log("The error ", 'Product exist')
                        r.release();
                        return res.status(201).json({ message: 'The selected product object has already been created. Use add stock option to stock the product ' })
                    } else {
                        query = "INSERT INTO store_products(product_number, store_type, product_category,date_created, details, isopened, store_number,stock_number)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"

                        r.query(query, [data.product_number, data.storetype, data.product_category, data.date_created, data.details, data.isopened, data.store_Number, data.store_stock_id], (error, results) => {

                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {

                                if (results.rowCount > 0) {
                                    COMMIT
                                    r.release()
                                    return res.status(200).json({ success: 'Request complete' })

                                } else {
                                  ROLLBACK;
                                    r.release()
                                    return res.status(201).json({ message: "Unable to connection to the Database" })
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





router.post('/listAllProducts', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  store_products.product_number, store_products.store_type, store_products.product_category, store_products.date_created, store_products.details, store_products.isopened, store_products.store_number, products.name  FROM store_products LEFT JOIN products ON   store_products.product_number=products.serialnumber  WHERE store_number=$1 '
            console.log('the data', data)
            r.query(query, [data.storeNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        return res.status(200).json({ data: results.rows })
                        r.release();

                    } else {
                        return res.status(201).json({ message: 'Products are not yet mounted for this sotre' })
                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})





router.post('/dropStoreproduct', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'DELETE   FROM store_products  WHERE store_number=$1 AND product_number=$2 '
            console.log('the data', data)
            r.query(query, [data.storeNumber, data.productNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rowCount > 0) {
                        return res.status(200).json({ success: 'Selected product successfully deleted' })
                        r.release();

                    } else {
                        return res.status(201).json({ message: 'Product could not be deleted' })
                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})






router.post('/authStoreType', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'UPDATE storetype SET authstore=$1 WHERE storeidentityid=$2'
            console.log('the data', data)
            r.query(query, [data.isAuth, data.typeid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log(results)
                    if (results.rowCount > 0) {
                        return res.status(200).json({ success: 'Authorisation success' })
                        r.release();

                    } else {
                        return res.status(201).json({ message: 'Unable to apply changes to hte selected stores' })
                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.post('/droptType', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'DELETE FROM  storetype  WHERE storeidentityid=$1'
            console.log('the data', data)
            r.query(query, [data.typeid], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    console.log(results)
                    if (results.rowCount > 0) {
                        return res.status(200).json({ success: 'Authorisation success' })
                        r.release();

                    } else {
                        return res.status(201).json({ message: 'Unable to apply changes to hte selected stores' })
                    }
                }
            })

        } else {
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})
module.exports = router