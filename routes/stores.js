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
            query = "SELECT stores.storenumber,stores.storename,stores.storetype,stores.storelacation,stores.digitaladdress,stores.storedescription,stores.dateposted,stores.isstoreopened,stores.storeidentityname FROM stores LEFT JOIN stores ON stores.storetype=stores.storeidentityid"
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
                    return res.status(201).json({ message: error })
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
                    console.log('The results received', results.rows)
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
            r.query('BEGIN');
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
                                            console.log("The error==== ", error)
                                            r.release();
                                            return res.status(201).json({ message: error })
                                        } else {

                                            if (results.rowCount > 0) {
                                                query = 'INSERT INTO store_products_stock(store_id, store_product_stock_id, store_product_category, store_products_brand_id, store_product_current_quantity,isstockopemend, datedopened, store_product_stock_new_quantity, store_product_total_quantity, store_product_number)' +
                                                    '  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
                                                r.query(query, [data.store_id, stock_number, product_category, data.stock_brandd, oldqty, true, data.date_opened, data.new_quantity, newQty, data.product_number], (error, results) => {
                                                    if (error) {
                                                        console.log("The error*/****/------------- ", error)
                                                        r.release();
                                                        return res.status(201).json({ message: error.detail })
                                                    } else {

                                                        query = "SELECT product_number,product_brand,store_number,avaible_quantity,quantity_sold,stock_balance,is_current,date_posted " +
                                                            " FROM  tb_daily_rotating_Stock WHERE  is_current=$1 AND store_number=$2 AND product_number=$3 AND product_brand=$4"

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


                                                                        prevqty = rws[i].stock_balance
                                                                        console.log('the results for rws', prevqty)
                                                                        totalQty = prevqty + data.new_quantity
                                                                        rws.total_quantity = totalQty
                                                                    }
                                                                    query = 'UPDATE tb_daily_rotating_Stock SET is_current=$1 WHERE store_number=$2 AND product_number=$3 AND product_brand=$4'
                                                                    r.query(query, [false, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                                        if (error) {
                                                                            console.log("The error ", error)
                                                                            r.release();
                                                                            return res.status(201).json({ message: error.detail })
                                                                        } else {

                                                                            query = "INSERT INTO tb_daily_rotating_Stock(store_number, product_number, avaible_quantity, date_posted, is_current, product_brand, new_quantity, total_quantity)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                                            r.query(query, [data.store_id, data.product_number, prevqty, data.transation_date, data.is_stock_opened, data.stock_brandd, data.new_quantity, rws.total_quantity], (error, results) => {
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
                                                                                                r.query('COMMIT');
                                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                                            } else {
                                                                                                r.release();
                                                                                                r.query('ROLLBACK');;
                                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                                            }
                                                                                        }
                                                                                    })

                                                                                }
                                                                            })
                                                                        }
                                                                    })

                                                                } else {

                                                                    query = "INSERT INTO tb_daily_rotating_Stock(store_number, product_number, avaible_quantity, date_posted, is_current, product_brand, new_quantity, stock_balance)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                                    r.query(query, [data.store_id, data.product_number, 0, data.transation_date, data.is_stock_opened, data.stock_brandd, data.new_quantity, data.new_quantity], (error, results) => {
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
                                                                                            r.query('COMMIT');
                                                                                            r.release();
                                                                                            return res.status(200).json({ success: "Store type successfully created" })
                                                                                        } else {
                                                                                            r.release();
                                                                                            return res.status(201).json({ message: "Transaction failed." })
                                                                                        }
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                r.release();
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
                                            console.log("The error******** ", error)
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {





                                            query = "SELECT product_number,product_brand,store_number,avaible_quantity,quantity_sold,stock_balance,is_current,date_posted " +
                                                " FROM  tb_daily_rotating_Stock WHERE  is_current=$1 AND store_number=$2 AND product_number=$3 AND product_brand=$4"

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


                                                            prevqty = rws[i].stock_balance
                                                            console.log('the results for rws', prevqty)
                                                            totalQty = prevqty + data.new_quantity
                                                            rws.total_quantity = totalQty
                                                        }
                                                        query = 'UPDATE tb_daily_rotating_Stock SET is_current=$1 WHERE store_number=$2 AND product_number=$3 AND product_brand=$4'
                                                        r.query(query, [false, data.store_id, data.product_number, data.stock_brandd], (error, results) => {
                                                            if (error) {
                                                                console.log("The error ", error)
                                                                r.release();
                                                                return res.status(201).json({ message: error.detail })
                                                            } else {

                                                                query = "INSERT INTO tb_daily_rotating_Stock(store_number, product_number, avaible_quantity, date_posted, is_current, product_brand, new_quantity, stock_balance)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                                r.query(query, [data.store_id, data.product_number, 0, data.transation_date, data.is_stock_opened, data.stock_brandd, data.new_quantity, data.new_quantity], (error, results) => {
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
                                                                                    r.query('COMMIT');
                                                                                    return res.status(200).json({ success: "Store type successfully created" })
                                                                                } else {
                                                                                    r.release();
                                                                                    r.query('ROLLBACK');;
                                                                                    return res.status(201).json({ message: "Transaction failed." })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })

                                                    } else {

                                                        query = "INSERT INTO tb_daily_rotating_Stock(store_number, product_number, avaible_quantity, date_posted, is_current, product_brand, new_quantity, stock_balance)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                        r.query(query, [data.store_id, data.product_number, 0, data.transation_date, data.is_stock_opened, data.stock_brandd, data.new_quantity, data.new_quantity], (error, results) => {
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
                                                                                r.query('COMMIT');
                                                                                return res.status(200).json({ success: "Store type successfully created" })
                                                                            } else {
                                                                                r.release();
                                                                                r.query('ROLLBACK');;
                                                                                return res.status(201).json({ message: "Transaction failed." })
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    r.release();
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
                        r.release();
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
            r.query('BEGIN');
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
                                    r.query('COMMIT');
                                    r.release()
                                    return res.status(200).json({ success: 'Request complete' })

                                } else {
                                    r.query('ROLLBACK');
                                    r.release()
                                    return res.status(201).json({ message: "Unable to connection to the Database" })
                                }

                            }
                        })
                    }
                }
            })

        } else {
            r.release();
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
                        r.release();
                        return res.status(201).json({ message: 'Products are not yet mounted for this sotre' })
                    }
                }
            })

        } else {
            r.release();
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
                        r.release();
                        return res.status(201).json({ message: 'Product could not be deleted' })
                    }
                }
            })

        } else {
            r.release();
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
                        r.release();
                        return res.status(201).json({ message: 'Unable to apply changes to hte selected stores' })
                    }
                }
            })

        } else {
            r.release();
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
                        r.release();
                        return res.status(201).json({ message: 'Unable to apply changes to hte selected stores' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



// loadStoreRecivedStock





router.post('/loadStoreRecivedStock', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_received_stock.stock_to_storeid, store_received_stock.stockoperationid, store_received_stock.from_warehouse_id, store_received_stock.store_id, store_received_stock.received_productid, store_received_stock.store_request_id, store_received_stock.quantity_requested, store_received_stock.date_received ,store_received_stock.received_details, store_received_stock.approve_receipt, store_received_stock.warehouse_stock_id, store_received_stock.received_brand, store_received_stock.quantity_received, productbrand.title,productbrand.imageurl, products.name FROM store_received_stock LEFT JOIN productbrand ON store_received_stock.received_brand=productbrand.brandid LEFT JOIN products ON store_received_stock.received_productid=products.serialnumber ORDER BY store_received_stock.date_received ASC LIMIT 500 '
            r.query(query, (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    // console.log(results.rows)
                    if (results.rows.length > 0) {
                        return res.status(200).json({ data: results.rows })
                        r.release();

                    } else {
                        console.log('Not found')
                        r.release();
                        return res.status(201).json({ message: 'Unable to apply changes to hte selected stores' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})




router.post('/loadsalseforVerification', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Checking invoice.....', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT * FROM tb_lock_invoices WHERE invoice_number=$1 AND store_number=$2'
            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    return res.status(201).json({ message: error.details })
                } else {
                    if (results.rows.length > 0) {
                        if (results.rows[0].is_locked) {
                            return res.status(201).json({ message: 'Items on this invoice are already supplied. No further verification required' })
                        } else {
                            query = 'SELECT invoice_summaries.invoice_number,invoice_summaries.dateposted,invoice_summaries.isinvoice_verified,invoice_summaries.is_payment_complete,invoice_summaries.sales_type, invoice_summaries.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                                '  FROM invoice_summaries LEFT JOIN tb_cashsale_invoices ON  invoice_summaries.invoice_number =tb_cashsale_invoices.invoice_number  WHERE invoice_summaries.invoice_number=$1  '
                            r.query(query, [data.invoiceNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error.details })
                                } else {
                                    if (results.rows.length > 0) {
                                        let auth = results.rows[0].isinvoice_verified
                                        if (auth) {
                                            let invoiceData = results.rows
                                            query = 'SELECT tb_cash_sales.invoice_number,tb_cash_sales.product_number,tb_cash_sales.purchaseid,tb_cash_sales.product_brand,tb_cash_sales.quantity_sold,tb_cash_sales.unit_price,tb_cash_sales.total_price,' +
                                                ' tb_cash_sales.dateposted,tb_cash_sales.isinvoice_verified,tb_cash_sales.isinvoice_paid,tb_cash_sales.invoice_submitted,tb_cash_sales.store_number,tb_cash_sales.store_verified, products.name,productbrand.title ' +
                                                ' FROM tb_cash_sales LEFT JOIN products ON  tb_cash_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand=productbrand.brandid WHERE tb_cash_sales.invoice_number=$1 AND  tb_cash_sales.store_number=$2  '
                                            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error.details })

                                                } else {
                                                    if (results.rows.length > 0) {
                                                        r.release();
                                                        return res.status(200).json({ data: results.rows, invoiceData })
                                                    } else {
                                                        r.release();
                                                        return res.status(201).json({ message: 'Invalid invoice' })
                                                    }
                                                }
                                            })
                                        } else {
                                            console.log('univeririfed invoice')
                                            r.release();
                                            return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                        }
                                    }
                                }
                            })
                        }
                    } else {

                        query = 'SELECT invoice_summaries.invoice_number,invoice_summaries.dateposted,invoice_summaries.isinvoice_verified,invoice_summaries.is_payment_complete,invoice_summaries.sales_type, invoice_summaries.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                            '  FROM invoice_summaries LEFT JOIN tb_cashsale_invoices ON  invoice_summaries.invoice_number =tb_cashsale_invoices.invoice_number  WHERE invoice_summaries.invoice_number=$1  '
                        r.query(query, [data.invoiceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error.details })
                            } else {
                                if (results.rows.length > 0) {
                                    let auth = results.rows[0].isinvoice_verified
                                    if (auth) {
                                        let invoiceData = results.rows
                                        query = 'SELECT tb_cash_sales.invoice_number,tb_cash_sales.product_number,tb_cash_sales.purchaseid,tb_cash_sales.product_brand,tb_cash_sales.quantity_sold,tb_cash_sales.unit_price,tb_cash_sales.total_price,' +
                                            ' tb_cash_sales.dateposted,tb_cash_sales.isinvoice_verified,tb_cash_sales.isinvoice_paid,tb_cash_sales.invoice_submitted,tb_cash_sales.store_number,tb_cash_sales.store_verified, products.name,productbrand.title ' +
                                            ' FROM tb_cash_sales LEFT JOIN products ON  tb_cash_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand=productbrand.brandid WHERE tb_cash_sales.invoice_number=$1 AND  tb_cash_sales.store_number=$2  '
                                        r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                return res.status(201).json({ message: error.details })

                                            } else {
                                                if (results.rows.length > 0) {
                                                    r.release();
                                                    return res.status(200).json({ data: results.rows, invoiceData })
                                                } else {
                                                    r.release();
                                                    return res.status(201).json({ message: 'Invalid invoice' })
                                                }
                                            }
                                        })
                                    } else {
                                        console.log('univeririfed invoice')
                                        r.release();
                                        return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                    }
                                }
                            }
                        })




                    }
                }
            })



        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



router.post('/submitProductVerification', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            r.query('BEGIN')

            query = 'SELECT * FROM tb_daily_rotating_stock WHERE store_number=$1 AND product_number=$2 AND product_brand=$3'
            r.query(query, [data.storeNumber, data.productNumber, data.brandNumber], (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    return res.status(201).json({ message: error.details })
                } else {

                    if (results.rows.length > 0) {
                        let stock = results.rows

                        query = 'UPDATE tb_daily_rotating_stock SET is_current=$1 WHERE  store_number=$2 AND product_number=$3 AND product_brand=$4'
                        r.query(query, [false, data.storeNumber, data.productNumber, data.brandNumber], (error, results) => {
                            if (error) {
                                r.query('ROLLBACK')
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error.details })
                            } else {

                                if (results.rowCount > 0) {
                                    let prevTotal = stock[0].stock_balance
                                    let stockBal = prevTotal - data.quantity
                                    console.log('The stock: ', stock)
                                    query = 'INSERT INTO tb_daily_rotating_stock(product_number,product_brand,store_number,avaible_quantity,quantity_sold,stock_balance,is_current,date_posted,new_quantity)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                    r.query(query, [data.productNumber, data.brandNumber, data.storeNumber, prevTotal, data.quantity, stockBal, true, new Date(), 0], (error, results) => {
                                        if (error) {
                                            r.query('ROLLBACK')
                                            r.release()
                                            console.log(error)
                                            return res.status(201).json({ message: error.details })
                                        } else {
                                            if (results.rowCount > 0) {

                                                query = 'UPDATE tb_cash_sales SET store_verified=$1 WHERE invoice_number=$2 AND store_number=$3 AND product_number=$4 AND purchaseid=$5 AND isinvoice_verified=$6 AND product_brand=$7'
                                                r.query(query, [true, data.invoiceNumber, data.storeNumber, data.productNumber, data.purchaseid, true, data.brandNumber], (error, results) => {
                                                    if (error) {
                                                        r.query('ROLLBACK')
                                                        r.release()
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.details })
                                                    } else {

                                                        if (results.rowCount > 0) {
                                                            query = 'UPDATE invoice_summaries SET store_verified=$1 WHERE invoice_number=$2 AND store_number=$3 AND sales_type=$4'
                                                            r.query(query, [true, data.invoiceNumber, data.storeNumber, data.sales_type], (error, results) => {
                                                                //   console.log('stock found',results)
                                                                if (error) {
                                                                    r.query('ROLLBACK')
                                                                    r.release()
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error.details })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.query('COMMIT')
                                                                        r.release()

                                                                        console.log('VERIFICATION SUCCESS')
                                                                        return res.status(201).json({ success: 'Product Verification successful' })
                                                                    } else {
                                                                        r.query('ROLLBACK')
                                                                        r.release()
                                                                        return res.status(201).json({ message: 'Verification failed. Contact Admin' })
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            r.query('ROLLBACK')
                                                            r.release()
                                                            return res.status(201).json({ message: 'Update failed.' })
                                                        }
                                                    }
                                                })


                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(201).json({ message: "Unknown error has occured" })
                                            }
                                        }
                                    })
                                } else {
                                    console.log('stock update failed')
                                    r.release();
                                    return res.status(201).json({ message: 'Stock update failed. Try again' })
                                }
                            }
                        })
                    } else {
                        console.log('stock update failed')
                        r.release();
                        return res.status(201).json({ message: 'Product not available' })
                    }
                }
            })
        }
    })
})

router.post('/closeInVoice', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = 'SELECT * FROM  tb_lock_invoices  WHERE invoice_number=$1 AND store_number=$2 '
            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = 'UPDATE tb_lock_invoices SET is_locked=$1,is_product_issued=$2 WHERE invoice_number=$3 AND store_number=$4 '
                        r.query(query, [true, true, data.invoiceNumber, data.storeNumber], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                console.log(results)
                                if (results.rowCount > 0) {
                                    return res.status(200).json({ success: 'Invoice successfully closed' })
                                    r.release();
                                } else {
                                    console.log('Not found')
                                    r.release();
                                    return res.status(201).json({ message: 'Request failed. Try again' })
                                }
                            }
                        })
                    } else {
                        query = 'INSERT INTO tb_lock_invoices(invoice_number,store_number,is_locked,date_locked,is_product_issued)VALUES($1,$2,$3,$4,$5)'
                        r.query(query, [data.invoiceNumber, data.storeNumber, true, new Date(), true], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    return res.status(200).json({ success: 'Invoice successfully closed' })
                                    r.release();
                                } else {
                                    console.log('Not found')
                                    r.release();
                                    return res.status(201).json({ message: 'Request failed. Try again' })
                                }
                            }
                        })

                    }
                }
            })
        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})






// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.post('/load_for_credit_verification', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Checking invoice..... settings', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log('checking connection')
            query = 'SELECT * FROM tb_lock_invoices WHERE invoice_number=$1 AND store_number=$2'
            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    return res.status(201).json({ message: error.details })
                } else {
                    console.log('checnking log invoice')

                    if (results.rows.length > 0) {

                        if (results.rows[0].is_locked) {
                            return res.status(201).json({ message: 'Items on this invoice are already supplied. No further verification required' })
                        } else {
                            query = 'SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.dateposted,tb_credit_invoice_summary.isinvoice_verified,tb_credit_invoice_summary.is_payment_complete,tb_credit_invoice_summary.sales_type, tb_credit_invoice_summary.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                                '  FROM tb_credit_invoice_summary LEFT JOIN tb_cashsale_invoices ON  tb_credit_invoice_summary.invoice_number =tb_cashsale_invoices.invoice_number  WHERE tb_credit_invoice_summary.invoice_number=$1  '
                            r.query(query, [data.invoiceNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error.details })
                                } else {
                                    if (results.rows.length > 0) {
                                        let auth = results.rows[0].isinvoice_verified
                                        if (auth) {
                                            let invoiceData = results.rows
                                            query = 'SELECT tb_credit_sales.invoice_number,tb_credit_sales.product_number,tb_credit_sales.purchaseid,tb_credit_sales.product_brand,tb_credit_sales.quantity_sold,tb_credit_sales.unit_price,tb_credit_sales.total_price,' +
                                                ' tb_credit_sales.dateposted,tb_credit_sales.isinvoice_verified,tb_credit_sales.invoice_submitted,tb_credit_sales.store_number,tb_credit_sales.store_verified, products.name,productbrand.title ' +
                                                ' FROM tb_credit_sales LEFT JOIN products ON  tb_credit_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand=productbrand.brandid WHERE tb_credit_sales.invoice_number=$1 AND  tb_credit_sales.store_number=$2  '
                                            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error.details })
                                                } else {
                                                    if (results.rows.length > 0) {
                                                        console.log(results.rows)
                                                        r.release();
                                                        return res.status(200).json({ data: results.rows, invoiceData })
                                                    } else {
                                                        console.log('not found')
                                                        r.release();
                                                        return res.status(201).json({ message: 'Invalid invoice' })
                                                    }
                                                }
                                            })
                                        } else {
                                            console.log('univeririfed invoice')
                                            r.release();
                                            return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                        }
                                    }
                                }
                            })
                        }
                    } else {

                        query = 'SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.dateposted,tb_credit_invoice_summary.isinvoice_verified,tb_credit_invoice_summary.is_payment_complete,tb_credit_invoice_summary.sales_type, tb_credit_invoice_summary.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                            '  FROM tb_credit_invoice_summary LEFT JOIN tb_cashsale_invoices ON  tb_credit_invoice_summary.invoice_number =tb_cashsale_invoices.invoice_number  WHERE tb_credit_invoice_summary.invoice_number=$1  '
                        r.query(query, [data.invoiceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error.details })
                            } else {
                                if (results.rows.length > 0) {
                                    let auth = results.rows[0].isinvoice_verified
                                    if (auth) {
                                        let invoiceData = results.rows
                                        query = 'SELECT tb_credit_sales.invoice_number,tb_credit_sales.product_number,tb_credit_sales.purchaseid,tb_credit_sales.product_brand,tb_credit_sales.quantity_sold,tb_credit_sales.unit_price,tb_credit_sales.total_price,' +
                                            ' tb_credit_sales.dateposted,tb_credit_sales.isinvoice_verified,tb_credit_sales.invoice_submitted,tb_credit_sales.store_number,tb_credit_sales.store_verified, products.name,productbrand.title ' +
                                            ' FROM tb_credit_sales LEFT JOIN products ON  tb_credit_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand=productbrand.brandid WHERE tb_credit_sales.invoice_number=$1 AND  tb_credit_sales.store_number=$2  '
                                        r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                return res.status(201).json({ message: error.details })

                                            } else {
                                                if (results.rows.length > 0) {
                                                    console.log(error)
                                                    r.release();
                                                    return res.status(200).json({ data: results.rows, invoiceData })
                                                } else {
                                                    console.log('invalid')
                                                    r.release();
                                                    return res.status(201).json({ message: 'Invalid invoice' })
                                                }
                                            }
                                        })
                                    } else {
                                        console.log('univeririfed invoice')
                                        r.release();
                                        return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                    }
                                }
                            }
                        })




                    }
                }
            })



        } else {
            console.log('Database connection failed')
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



router.post('/submit_credit_for_verification', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            r.query('BEGIN')

            query = 'SELECT * FROM tb_daily_rotating_stock WHERE store_number=$1 AND product_number=$2 AND product_brand=$3'
            r.query(query, [data.storeNumber, data.productNumber, data.brandNumber], (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    return res.status(201).json({ message: error.details })
                } else {

                    if (results.rows.length > 0) {
                        let stock = results.rows

                        query = 'UPDATE tb_daily_rotating_stock SET is_current=$1 WHERE  store_number=$2 AND product_number=$3 AND product_brand=$4'
                        r.query(query, [false, data.storeNumber, data.productNumber, data.brandNumber], (error, results) => {
                            if (error) {
                                r.query('ROLLBACK')
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error.details })
                            } else {

                                if (results.rowCount > 0) {
                                    let prevTotal = stock[0].stock_balance
                                    let stockBal = prevTotal - data.quantity
                                    console.log('The stock: ', stock)
                                    query = 'INSERT INTO tb_daily_rotating_stock(product_number,product_brand,store_number,avaible_quantity,quantity_sold,stock_balance,is_current,date_posted,new_quantity)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                    r.query(query, [data.productNumber, data.brandNumber, data.storeNumber, prevTotal, data.quantity, stockBal, true, new Date(), 0], (error, results) => {
                                        if (error) {
                                            r.query('ROLLBACK')
                                            r.release()
                                            console.log(error)
                                            return res.status(201).json({ message: error.details })
                                        } else {
                                            if (results.rowCount > 0) {

                                                query = 'UPDATE tb_credit_sales SET store_verified=$1 WHERE invoice_number=$2 AND store_number=$3 AND product_number=$4 AND purchaseid=$5 AND isinvoice_verified=$6 AND product_brand=$7'
                                                r.query(query, [true, data.invoiceNumber, data.storeNumber, data.productNumber, data.purchaseid, true, data.brandNumber], (error, results) => {
                                                    if (error) {
                                                        r.query('ROLLBACK')
                                                        r.release()
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.details })
                                                    } else {

                                                        if (results.rowCount > 0) {
                                                            query = 'UPDATE tb_credit_invoice_summary SET store_verified=$1 WHERE invoice_number=$2 AND store_number=$3 AND sales_type=$4'
                                                            r.query(query, [true, data.invoiceNumber, data.storeNumber, data.sales_type], (error, results) => {
                                                                //   console.log('stock found',results)
                                                                if (error) {
                                                                    r.query('ROLLBACK')
                                                                    r.release()
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error.details })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.query('COMMIT')
                                                                        r.release()

                                                                        console.log('VERIFICATION SUCCESS')
                                                                        return res.status(201).json({ success: 'Product Verification successful' })
                                                                    } else {
                                                                        r.query('ROLLBACK')
                                                                        r.release()
                                                                        return res.status(201).json({ message: 'Verification failed. Contact Admin' })
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            r.query('ROLLBACK')
                                                            r.release()
                                                            return res.status(201).json({ message: 'Update failed' })
                                                        }
                                                    }
                                                })


                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(201).json({ message: "Unknown error has occured" })
                                            }
                                        }
                                    })
                                } else {
                                    console.log('stock update failed')
                                    r.release();
                                    return res.status(201).json({ message: 'Stock update failed. Try again' })
                                }
                            }
                        })
                    } else {
                        console.log('stock update failed')
                        r.release();
                        return res.status(201).json({ message: 'Product not available' })
                    }
                }
            })
        }
    })
})

router.post('/closeCreditInVoice', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = 'SELECT * FROM  tb_lock_invoices  WHERE invoice_number=$1 AND store_number=$2 '
            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                if (error) {
                    console.log("The error ", error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = 'UPDATE tb_lock_invoices SET is_locked=$1,is_product_issued=$2 WHERE invoice_number=$3 AND store_number=$4 '
                        r.query(query, [true, true, data.invoiceNumber, data.storeNumber], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                console.log(results)
                                if (results.rowCount > 0) {
                                    return res.status(200).json({ success: 'Invoice successfully closed' })
                                    r.release();
                                } else {
                                    console.log('Not found')
                                    r.release();
                                    return res.status(201).json({ message: 'Request failed. Try again' })
                                }
                            }
                        })
                    } else {
                        query = 'INSERT INTO tb_lock_invoices(invoice_number,store_number,is_locked,date_locked,is_product_issued)VALUES($1,$2,$3,$4,$5)'
                        r.query(query, [data.invoiceNumber, data.storeNumber, true, new Date(), true], (error, results) => {
                            if (error) {
                                console.log("The error ", error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release();
                                    return res.status(200).json({ success: 'Invoice successfully closed' })

                                } else {
                                    console.log('Not found')
                                    r.release();
                                    return res.status(201).json({ message: 'Request failed. Try again' })
                                }
                            }
                        })

                    }
                }
            })
        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})
// load_store_request






router.post('/load_for_credit_verification', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('Checking invoice..... settings', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            console.log('checking connection')
            query = 'SELECT * FROM tb_lock_invoices WHERE invoice_number=$1 AND store_number=$2'
            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    return res.status(201).json({ message: error.details })
                } else {
                    console.log('checnking log invoice')

                    if (results.rows.length > 0) {

                        if (results.rows[0].is_locked) {
                            return res.status(201).json({ message: 'Items on this invoice are already supplied. No further verification required' })
                        } else {
                            query = 'SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.dateposted,tb_credit_invoice_summary.isinvoice_verified,tb_credit_invoice_summary.is_payment_complete,tb_credit_invoice_summary.sales_type, tb_credit_invoice_summary.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                                '  FROM tb_credit_invoice_summary LEFT JOIN tb_cashsale_invoices ON  tb_credit_invoice_summary.invoice_number =tb_cashsale_invoices.invoice_number  WHERE tb_credit_invoice_summary.invoice_number=$1  '
                            r.query(query, [data.invoiceNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error.details })
                                } else {
                                    if (results.rows.length > 0) {
                                        let auth = results.rows[0].isinvoice_verified
                                        if (auth) {
                                            let invoiceData = results.rows
                                            query = 'SELECT tb_credit_sales.invoice_number,tb_credit_sales.product_number,tb_credit_sales.purchaseid,tb_credit_sales.product_brand,tb_credit_sales.quantity_sold,tb_credit_sales.unit_price,tb_credit_sales.total_price,' +
                                                ' tb_credit_sales.dateposted,tb_credit_sales.isinvoice_verified,tb_credit_sales.invoice_submitted,tb_credit_sales.store_number,tb_credit_sales.store_verified, products.name,productbrand.title ' +
                                                ' FROM tb_credit_sales LEFT JOIN products ON  tb_credit_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand=productbrand.brandid WHERE tb_credit_sales.invoice_number=$1 AND  tb_credit_sales.store_number=$2  '
                                            r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error.details })

                                                } else {
                                                    if (results.rows.length > 0) {
                                                        console.log(results.rows)
                                                        r.release();
                                                        return res.status(200).json({ data: results.rows, invoiceData })
                                                    } else {
                                                        r.release();
                                                        console.log('not found')
                                                        return res.status(201).json({ message: 'Invalid invoice' })
                                                    }
                                                }
                                            })
                                        } else {
                                            r.release();
                                            console.log('univeririfed invoice')
                                            return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                        }
                                    }
                                }
                            })
                        }
                    } else {

                        query = 'SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.dateposted,tb_credit_invoice_summary.isinvoice_verified,tb_credit_invoice_summary.is_payment_complete,tb_credit_invoice_summary.sales_type, tb_credit_invoice_summary.payment_progress, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address' +
                            '  FROM tb_credit_invoice_summary LEFT JOIN tb_cashsale_invoices ON  tb_credit_invoice_summary.invoice_number =tb_cashsale_invoices.invoice_number  WHERE tb_credit_invoice_summary.invoice_number=$1  '
                        r.query(query, [data.invoiceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error.details })
                            } else {
                                if (results.rows.length > 0) {
                                    let auth = results.rows[0].isinvoice_verified
                                    if (auth) {
                                        let invoiceData = results.rows
                                        query = 'SELECT tb_credit_sales.invoice_number,tb_credit_sales.product_number,tb_credit_sales.purchaseid,tb_credit_sales.product_brand,tb_credit_sales.quantity_sold,tb_credit_sales.unit_price,tb_credit_sales.total_price,' +
                                            ' tb_credit_sales.dateposted,tb_credit_sales.isinvoice_verified,tb_credit_sales.invoice_submitted,tb_credit_sales.store_number,tb_credit_sales.store_verified, products.name,productbrand.title ' +
                                            ' FROM tb_credit_sales LEFT JOIN products ON  tb_credit_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand=productbrand.brandid WHERE tb_credit_sales.invoice_number=$1 AND  tb_credit_sales.store_number=$2  '
                                        r.query(query, [data.invoiceNumber, data.storeNumber], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                return res.status(201).json({ message: error.details })

                                            } else {
                                                if (results.rows.length > 0) {
                                                    console.log(error)
                                                    r.release();
                                                    return res.status(200).json({ data: results.rows, invoiceData })
                                                } else {
                                                    r.release();
                                                    console.log('invalid')
                                                    return res.status(201).json({ message: 'Invalid invoice' })
                                                }
                                            }
                                        })
                                    } else {
                                        r.release();
                                        console.log('univeririfed invoice')
                                        return res.status(201).json({ message: 'Unverified Invoice. Return for verification' })
                                    }
                                }
                            }
                        })




                    }
                }
            })



        } else {
            r.release();
            console.log('Database connection failed')
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.post('/submitReques', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('data,', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {

            query = 'SELECT * FROM  stock_request_control WHERE  request_number=$1 '
            r.query(query, [data.request_number], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    const ifRows = results.rows.length
                    console.log('ifRows: ', results.rows.length)
                    if (results.rows.length > 0) {

                        const check = results.rows[0].request_approved
                        if (check === true) {
                            r.release();
                            return res.status(200).json({ message: 'Request is closed' })

                        } else {
                            if (check === false) {

                                query = 'INSERT INTO store_stock_request(product_number,brand_number,cartegory,request_number,quantity,store_number,date_resquested,is_submitted,request_approved,date_approved,description,itemrowid)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                                r.query(query, [data.productNumber, data.productBrand, data.category, data.requestNumber, data.quantity, data.storeNumber, data.reuqestDat, false, false, null, data.description, data.itemrowid], (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        r.release();
                                        return res.status(201).json({ message: error.detail })
                                    } else {
                                        if (results.rowCount > 0) {
                                            r.release();
                                            return res.status(200).json({ success: 'Item added successfully' })
                                        } else {
                                            r.release();
                                            return res.status(200).json({ message: 'Request failed' })
                                        }
                                    }
                                })


                            } else {
                                r.release();
                                return res.status(200).json({ message: 'Request status cannot be identified' })
                            }
                        }

                    } else {
                        if (data.isMultiple === true) {

                            if (ifRows > 0) {

                                query = 'INSERT INTO store_stock_request(product_number,brand_number,cartegory,request_number,quantity,store_number,date_resquested,is_submitted,request_approved,date_approved,description,itemrowid)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                                r.query(query, [data.productNumber, data.productBrand, data.category, data.requestNumber, data.quantity, data.storeNumber, data.reuqestDat, false, false, null, data.description, data.itemrowid], (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        r.release();
                                        return res.status(201).json({ message: error.detail })
                                    } else {
                                        if (results.rowCount > 0) {
                                            console.log('success')
                                            r.release();
                                            return res.status(200).json({ success: 'Item added successfully' })
                                        } else {
                                            r.release();
                                            console.log('success')
                                            return res.status(200).json({ message: 'Request failed' })
                                        }
                                    }
                                })

                            } else {
                                console.log('firs insertion')
                                query = 'INSERT INTO stock_request_control(request_number,date_resquested,is_submitted,store_number)VALUES($1,$2,$3,$4) '
                                r.query(query, [data.requestNumber, data.reuqestDat, false, data.storeNumber], (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        r.release();
                                    } else {
                                        if (results.rowCount > 0) {
                                            query = 'INSERT INTO store_stock_request(product_number,brand_number,cartegory,request_number,quantity,store_number,date_resquested,is_submitted,request_approved,date_approved,description,itemrowid)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                                            r.query(query, [data.productNumber, data.productBrand, data.category, data.requestNumber, data.quantity, data.storeNumber, data.reuqestDat, false, false, null, data.description, data.itemrowid], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release();
                                                    return res.status(201).json({ message: error.detail })
                                                } else {
                                                    if (results.rowCount > 0) {
                                                        console.log('success')
                                                        r.release();
                                                        return res.status(200).json({ success: 'Item added successfully' })
                                                    } else {
                                                        r.release();
                                                        console.log('success')
                                                        return res.status(200).json({ message: 'Request failed' })
                                                    }
                                                }
                                            })

                                        } else {
                                            r.release();
                                            return res.status(201).json({ message: 'Request failed.' })
                                        }
                                    }
                                })

                            }

                        } else {

                            query = 'INSERT INTO stock_request_control(request_number,date_resquested,is_submitted,store_number)VALUES($1,$2,$3,$4) '
                            r.query(query, [data.requestNumber, data.reuqestDat, false, data.storeNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release();
                                } else {
                                    if (results.rowCount > 0) {
                                        query = 'INSERT INTO store_stock_request(product_number,brand_number,cartegory,request_number,quantity,store_number,date_resquested,is_submitted,request_approved,date_approved,description,itemrowid)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                                        r.query(query, [data.productNumber, data.productBrand, data.category, data.requestNumber, data.quantity, data.storeNumber, data.reuqestDat, false, false, null, data.description, data.itemrowid], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release();
                                                return res.status(201).json({ message: error.detail })
                                            } else {
                                                if (results.rowCount > 0) {
                                                    console.log('success')
                                                    r.release();
                                                    return res.status(200).json({ success: 'Item added successfully' })
                                                } else {
                                                    r.release();
                                                    console.log(failed)
                                                    return res.status(200).json({ message: 'Request failed' })
                                                }
                                            }
                                        })

                                    } else {
                                        r.release();
                                        return res.status(201).json({ message: 'Request failed.' })
                                    }
                                }
                            })


                        }
                    }
                }
            })

        } else {
            r.release();
            console.log('Unable to connection to the Database')
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})



router.post('/load_store_request', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_stocK_request.product_number, store_stocK_request.brand_number, store_stocK_request.cartegory, store_stocK_request.request_number, store_stocK_request.quantity, store_stocK_request.store_number, store_stocK_request.date_resquested, ' +
                'store_stocK_request.is_submitted, store_stocK_request.request_approved, store_stocK_request.date_approved, store_stocK_request.description, store_stocK_request.itemrowid,' +
                'products.name, productbrand.title FROM store_stocK_request LEFT JOIN products ON store_stocK_request.product_number=products.serialnumber LEFT JOIN productbrand ON store_stocK_request.brand_number=productbrand.brandid WHERE store_stocK_request.request_number=$1 AND store_stocK_request.is_submitted=$2'
            r.query(query, [data.request_number, false], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        return res.status(200).json({ data: results.rows })
                        r.release();
                    } else {
                        console.log('Not found')
                        r.release();
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


router.post('/find_store_request', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_stocK_request.product_number, store_stocK_request.brand_number, store_stocK_request.cartegory, store_stocK_request.request_number, store_stocK_request.quantity, store_stocK_request.store_number, store_stocK_request.date_resquested, ' +
                'store_stocK_request.is_submitted, store_stocK_request.request_approved, store_stocK_request.date_approved, store_stocK_request.description,store_stocK_request.itemrowid,' +
                'products.name, productbrand.title FROM store_stocK_request LEFT JOIN products ON store_stocK_request.product_number=products.serialnumber LEFT JOIN productbrand ON store_stocK_request.brand_number=productbrand.brandid WHERE store_stocK_request.request_number=$1'
            r.query(query, [data.request_number], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })

                    } else {
                        console.log('Not found')
                        r.release();
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {

            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})








router.post('/dropRequest', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT * FROM stock_request_control  WHERE request_number=$1'
            r.query(query, [data.request_number], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = 'DELETE FROM stock_request_control  WHERE request_number=$1'
                        r.query(query, [data.request_number], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {

                                    query = 'DELETE FROM store_stocK_request  WHERE request_number=$1'
                                    r.query(query, [data.request_number], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {
                                            if (results.rowCount > 0) {
                                                console.log('success')
                                                return res.status(201).json({ success: 'Request was successful' })
                                            } else {
                                                r.release();
                                                console.log('Not failed')
                                                return res.status(201).json({ message: 'Request failed' })
                                            }
                                        }
                                    })

                                } else {
                                    r.release();
                                    console.log('Not failed')
                                    return res.status(201).json({ message: 'Request failed' })
                                }
                            }
                        })
                    } else {
                        r.release();
                        console.log('Not found')
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {
            r.release();

            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


// 


router.post('/findPending', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_stocK_request.product_number, store_stocK_request.brand_number, store_stocK_request.cartegory, store_stocK_request.request_number, store_stocK_request.quantity, store_stocK_request.store_number, store_stocK_request.date_resquested, ' +
                'store_stocK_request.is_submitted, store_stocK_request.request_approved, store_stocK_request.date_approved, store_stocK_request.description,store_stocK_request.itemrowid,' +
                'products.name, productbrand.title FROM store_stocK_request LEFT JOIN products ON store_stocK_request.product_number=products.serialnumber LEFT JOIN productbrand ON store_stocK_request.brand_number=productbrand.brandid WHERE store_stocK_request.store_number=$1 AND store_stocK_request.request_approved=$2'
            r.query(query, [data.storeNumber, false], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        const pending = results.rows
                        query = 'SELECT request_number FROM stock_request_control WHERE request_approved=$1 AND store_number=$2'
                        r.query(query, [false, data.storeNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rows.length > 0) {
                                    console.log( results.rows)
                                r.release();
                                    return res.status(200).json({ data: pending, requests: results.rows })
                                } else {
                                     r.release();
                                     console.log('no results found')
                                }
                            }
                        })
                    } else {
                        r.release();
                        console.log('Not found')
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {

            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})






router.post('/dropRequest_Item', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {

        query = 'DELETE FROM store_stocK_request  WHERE itemrowid=$1'
        r.query(query, [data.itemrowid], (error, results) => {
            if (error) {
                console.log(error)
                r.release();
                return res.status(201).json({ message: error.detail })
            } else {
                if (results.rowCount > 0) {
                    r.release();
                    console.log('success')
                    return res.status(201).json({ success: 'Request was successful' })
                } else {
                    r.release();
                    console.log('Not failed')
                    return res.status(201).json({ message: 'Request failed' })
                }
            }
        })
    })
})


// load_store_request_history


router.post('/load_store_request_history', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_stocK_request.product_number, store_stocK_request.brand_number, store_stocK_request.cartegory, store_stocK_request.request_number, store_stocK_request.quantity, store_stocK_request.store_number, store_stocK_request.date_resquested, ' +
                'store_stocK_request.is_submitted, store_stocK_request.request_approved, store_stocK_request.date_approved, store_stocK_request.description,store_stocK_request.itemrowid,' +
                'products.name, productbrand.title FROM store_stocK_request LEFT JOIN products ON store_stocK_request.product_number=products.serialnumber LEFT JOIN productbrand ON store_stocK_request.brand_number=productbrand.brandid WHERE store_stocK_request.store_number=$1'
            r.query(query, [data.storeNumber], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })

                    } else {
                        r.release();
                        console.log('Not found')
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})


// submitRequest


router.post('/submitRequest', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body

    await pool.connect().then(async (r) => {
        if (r._connected) {
            r.query('BEGIN')
            console.log(data)
            query = 'SELECT * FROM stock_request_control  WHERE request_number=$1'
            r.query(query, [data.request_number], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('submitting request')
                        query = 'UPDATE  stock_request_control SET is_submitted=$1, date_resquested=$2 WHERE request_number=$3 '
                        r.query(query, [data.submitted, data.date_submitted, data.request_number], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.query('ROLLBACK')
                                r.release();
                                return res.status(201).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    query = 'UPDATE  store_stock_request  SET is_submitted=$1, date_resquested=$2 WHERE request_number=$3 '
                                    r.query(query, [data.submitted, data.date_submitted, data.request_number], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.query('ROLLBACK')
                                            r.release();
                                            return res.status(201).json({ message: error.detail })
                                        } else {
                                            if (results.rowCount > 0) {
                                                r.query('COMMIT')
                                                res.status(200).json({ success: 'Request successfully summited' })
                                            } else {
                                                r.release();
                                                console.log('failed')
                                                r.query('ROLLBACK')
                                                return res.status(201).json({ message: 'Submission failed' })
                                            }
                                        }
                                    })
                                } else {
                                    r.release();
                                    console.log('failed')
                                    r.query('ROLLBACK')
                                    return res.status(201).json({ message: 'Submission failed' })
                                }
                            }
                        })

                    } else {
                        r.release();
                        r.query('ROLLBACK')
                        console.log('request not found')
                        return res.status(201).json({ message: 'Request is not available' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})






router.post('/findPendingItem', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('finding',data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT store_stocK_request.product_number, store_stocK_request.brand_number, store_stocK_request.cartegory, store_stocK_request.request_number, store_stocK_request.quantity, store_stocK_request.store_number, store_stocK_request.date_resquested, ' +
                'store_stocK_request.is_submitted, store_stocK_request.request_approved, store_stocK_request.date_approved, store_stocK_request.description,store_stocK_request.itemrowid,' +
                'products.name, productbrand.title FROM store_stocK_request LEFT JOIN products ON store_stocK_request.product_number=products.serialnumber LEFT JOIN productbrand ON'+
                ' store_stocK_request.brand_number=productbrand.brandid WHERE store_stocK_request.store_number=$1 AND store_stocK_request.request_number=$2'
            r.query(query, [data.store_number,data.request_number ], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release();
                    return res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release();
                        return res.status(200).json({ data: results.rows })

                    } else {
                        r.release();
                        console.log('Not found')
                        return res.status(201).json({ message: 'No request place for your store' })
                    }
                }
            })

        } else {
            r.release();
            return res.status(201).json({ message: "Unable to connection to the Database" })
        }
    })
})

module.exports = router
