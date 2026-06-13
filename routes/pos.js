const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
const { Query } = require("pg");
require('dotenv').config()
const router = express.Router()



router.get('/getAllproducts', cors({ origin: '*' }), async (req, res) => {
    console.log('getting pos records')
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT  tb_daily_rotating_Stock.product_number, products.name, tb_daily_rotating_Stock.product_brand,productbrand.title,productbrand.imageurl,productbrand.role, productprice.unitesellingprice,productprice.cartsellingprice, " +
                    " tb_daily_rotating_Stock.store_number,tb_daily_rotating_Stock.stock_balance,stores.storename FROM tb_daily_rotating_Stock LEFT JOIN productbrand ON  tb_daily_rotating_Stock.product_brand=productbrand.brandid " +
                    "LEFT JOIN products ON tb_daily_rotating_Stock.product_number=products.serialnumber LEFT JOIN stores ON tb_daily_rotating_Stock.store_number=stores.storenumber LEFT JOIN productprice ON tb_daily_rotating_Stock.product_brand=productprice.brandid  WHERE tb_daily_rotating_Stock.is_current=$1  "
                r.query(query, [true], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            console.log('node foun')
                            res.status(201).json({ message: 'No products found' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})


router.post('/loadTempSales', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = 'SELECT * FROM tb_cashsale_invoices  WHERE invoice_number=$1'
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            if (results.rows[0].isinvoice_verified === true) {
                                r.release()
                                console.log(error)
                                return res.status(201).json({ message: 'Invoice has already been verified. Prepare a new invoice' })
                            } else {
                                query = "SELECT tb_cash_sale_temp.invoice_number,tb_cash_sale_temp.purchaseid,tb_cash_sale_temp.ProductId,tb_cash_sale_temp.brand,tb_cash_sale_temp.quantity,tb_cash_sale_temp.unitprice,tb_cash_sale_temp.totalcost, productbrand.title,products.name,stores.storename FROM tb_cash_sale_temp LEFT JOIN  products ON  tb_cash_sale_temp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_cash_sale_temp.brand=productbrand.brandid LEFT JOIN stores ON tb_cash_sale_temp.store_number=stores.storenumber  WHERE tb_cash_sale_temp.invoice_number=$1  "
                                r.query(query, [data.invoceNumber], (error, results) => {
                                    if (error) {
                                        r.release()
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (results.rows.length > 0) {
                                            let rws = results.rows
                                            query = 'SELECT SUM(totalcost) AS total FROM tb_cash_sale_temp WHERE invoice_number = $1'
                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error })
                                                } else {

                                                    if (results.rows.length > 0) {
                                                        console.log(rws)
                                                        r.release()
                                                        return res.status(200).json({ data: rws, sumtotal: results.rows })
                                                    } else {
                                                        console.log('failed')
                                                        r.release()
                                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                                    }
                                                }
                                            })

                                            // 
                                        } else {
                                            console.log('node foun')
                                            r.release()
                                            res.status(201).json({ message: 'No products found' })
                                        }
                                    }
                                })




                            }
                        } else {
                            r.release()
                            console.log(error)
                            return res.status(201).json({ message: 'Invoice not available' })
                        }
                    }
                })



            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



router.post('/load_invoice_for_update', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('load_invoice_for_update', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = 'SELECT * FROM tb_cashsale_invoices  WHERE invoice_number=$1'
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            if (results.rows[0].isinvoice_verified === true) {
                                r.release()
                                console.log(error)
                                return res.status(201).json({ message: 'Invoice has already been verified. Prepare a new invoice' })
                            } else {
                                const invoiceData = results.rows
                                query = "SELECT tb_cash_sale_temp.invoice_number,tb_cash_sale_temp.purchaseid,tb_cash_sale_temp.ProductId,tb_cash_sale_temp.brand,tb_cash_sale_temp.quantity,tb_cash_sale_temp.unitprice,tb_cash_sale_temp.totalcost, productbrand.title,products.name,stores.storename FROM tb_cash_sale_temp LEFT JOIN  products ON  tb_cash_sale_temp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_cash_sale_temp.brand=productbrand.brandid LEFT JOIN stores ON tb_cash_sale_temp.store_number=stores.storenumber  WHERE tb_cash_sale_temp.invoice_number=$1  "
                                r.query(query, [data.invoceNumber], (error, results) => {
                                    if (error) {
                                        r.release()
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (results.rows.length > 0) {
                                            let rws = results.rows
                                            query = 'SELECT SUM(totalcost) AS total FROM tb_cash_sale_temp WHERE invoice_number = $1'
                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error })
                                                } else {

                                                    if (results.rows.length > 0) {
                                                        console.log(rws)
                                                        r.release()
                                                        return res.status(200).json({ data: rws, sumtotal: results.rows, invoice: invoiceData })
                                                    } else {
                                                        console.log('failed')
                                                        r.release()
                                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                                    }
                                                }
                                            })

                                            // 
                                        } else {
                                            console.log('node found')
                                            r.release()
                                            res.status(201).json({ message: 'Invoice has been closed' })
                                        }
                                    }
                                })




                            }
                        } else {
                            r.release()
                            console.log(error)
                            return res.status(201).json({ message: 'Invoice not available' })
                        }
                    }
                })



            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/verify_invoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('verify invoice', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = 'SELECT * FROM tb_cashsale_invoices  WHERE invoice_number=$1'
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            if (results.rows[0].isinvoice_verified === true) {
                                r.release()
                                console.log(error)
                                return res.status(201).json({ message: 'Invoice has already been verified. Prepare a new invoice' })
                            } else {
                                const invoiceData = results.rows
                                query = "SELECT tb_cash_sales.invoice_number, tb_cash_sales.purchaseid, tb_cash_sales.product_number, tb_cash_sales.product_brand, tb_cash_sales.quantity_sold, tb_cash_sales.unit_price, tb_cash_sales.total_price, productbrand.title, products.name, stores.storename FROM tb_cash_sales LEFT JOIN  products ON  tb_cash_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand=productbrand.brandid LEFT JOIN stores ON tb_cash_sales.store_number=stores.storenumber  WHERE tb_cash_sales.invoice_number=$1  "
                                r.query(query, [data.invoceNumber], (error, results) => {
                                    if (error) {
                                        r.release()
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (results.rows.length > 0) {
                                            let rws = results.rows
                                            query = 'SELECT SUM(total_price) AS total FROM tb_cash_sales WHERE invoice_number = $1'
                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error })
                                                } else {

                                                    if (results.rows.length > 0) {
                                                        console.log('The invoice Data: =>',invoiceData)
                                                        r.release()
                                                        return res.status(200).json({ data: rws, sumtotal: results.rows, invoice: invoiceData })
                                                    } else {
                                                        console.log('failed')
                                                        r.release()
                                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                                    }
                                                }
                                            })

                                            // 
                                        } else {
                                            console.log('node found')
                                            r.release()
                                            res.status(201).json({ message: 'Invoice has been closed' })
                                        }
                                    }
                                })




                            }
                        } else {
                            r.release()
                            console.log(error)
                            return res.status(201).json({ message: 'Invoice not available' })
                        }
                    }
                })



            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



router.post('/verify_credit_invoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('verify credit invoice', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = 'SELECT * FROM tb_credit_sale_invoice  WHERE invoice_number=$1'
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            if (results.rows[0].isinvoice_verified === true) {
                                r.release()
                                console.log(error)
                                return res.status(201).json({ message: 'Invoice has already been verified. Prepare a new invoice' })
                            } else {
                                const invoiceData = results.rows
                                query = "SELECT tb_credit_sales.invoice_number, tb_credit_sales.purchaseid, tb_credit_sales.product_number, tb_credit_sales.product_brand, tb_credit_sales.quantity_sold, tb_credit_sales.unit_price, tb_credit_sales.total_price, productbrand.title, products.name, stores.storename FROM tb_credit_sales LEFT JOIN  products ON  tb_credit_sales.product_number=products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand=productbrand.brandid LEFT JOIN stores ON tb_credit_sales.store_number=stores.storenumber  WHERE tb_credit_sales.invoice_number=$1  "
                                r.query(query, [data.invoceNumber], (error, results) => {
                                    if (error) {
                                        r.release()   
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (results.rows.length > 0) {
                                            let rws = results.rows
                                            query = 'SELECT SUM(total_price) AS total FROM tb_credit_sales WHERE invoice_number = $1'
                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error })
                                                } else {

                                                    if (results.rows.length > 0) {
                                                        console.log('The invoice Data: =>',invoiceData)
                                                        r.release()
                                                        return res.status(200).json({ data: rws, sumtotal: results.rows, invoice: invoiceData })
                                                    } else {
                                                        console.log('failed')
                                                        r.release()
                                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                                    }
                                                }
                                            })

                                            // 
                                        } else {
                                            console.log('node found')
                                            r.release()
                                            res.status(201).json({ message: 'Invoice has been closed' })
                                        }
                                    }
                                })




                            }
                        } else {
                            r.release()
                            console.log(error)
                            return res.status(201).json({ message: 'Invoice not available' })
                        }
                    }
                })



            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/load_credit_invoice_for_update', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('checking Data: =>', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = 'SELECT * FROM tb_credit_sale_invoice  WHERE invoice_number=$1'
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            if (results.rows[0].isinvoice_verified === true) {
                                r.release()
                                console.log(error)
                                return res.status(201).json({ message: 'Invoice has already been verified. Prepare a new invoice' })
                            } else {
                                const invoiceData = results.rows
                                query = "SELECT tb_credit_saletemp.invoice_number,tb_credit_saletemp.purchaseid,tb_credit_saletemp.ProductId,tb_credit_saletemp.brand,tb_credit_saletemp.quantity,tb_credit_saletemp.unitprice,tb_credit_saletemp.totalcost, productbrand.title,products.name,stores.storename FROM tb_credit_saletemp LEFT JOIN  products ON  tb_credit_saletemp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_credit_saletemp.brand=productbrand.brandid LEFT JOIN stores ON tb_credit_saletemp.store_number=stores.storenumber  WHERE tb_credit_saletemp.invoice_number=$1  "
                                r.query(query, [data.invoceNumber], (error, results) => {
                                    if (error) {
                                        r.release()
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (results.rows.length > 0) {
                                            let rws = results.rows
                                            query = 'SELECT SUM(totalcost) AS total FROM tb_credit_saletemp WHERE invoice_number = $1'
                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error })
                                                } else {

                                                    if (results.rows.length > 0) {
                                                        console.log(rws)
                                                        r.release()
                                                        return res.status(200).json({ data: rws, sumtotal: results.rows, invoice: invoiceData })
                                                    } else {
                                                        console.log('failed')
                                                        r.release()
                                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                                    }
                                                }
                                            })

                                            // 
                                        } else {
                                            console.log('node found')
                                            r.release()
                                            res.status(201).json({ message: 'Invoice has been closed' })
                                        }
                                    }
                                })




                            }
                        } else {
                            r.release()
                            console.log(error)
                            return res.status(201).json({ message: 'Invoice not available' })
                        }
                    }
                })



            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/AddCart', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Add to Cart', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number FROM tb_cashsale_invoices WHERE invoice_number=$1 '
                r.query(query, [data.invoiceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            query = "INSERT INTO tb_cash_sale_temp(invoice_number,productid,brand,quantity,unitprice,totalcost,purchaseid,customertype,store_number,sales_type)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                            r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.purchaseId, data.customerType, data.storeNumber, data.salesObject], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        return res.status(200).json({ success: "Request success" })
                                    } else {
                                        r.release()
                                        console.log('Request failed. Try again')
                                        return res.status(200).json({ message: 'Request failed. Try again' })
                                    }
                                }

                            })
                        } else {
                            r.release()
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }

                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})








router.post('/removepurchase', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Add to Cart', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number FROM tb_cashsale_invoices WHERE invoice_number=$1 '
                r.query(query, [data.invoice_number], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            query = " DELETE FROM tb_cash_sale_temp WHERE invoice_number=$1 AND purchaseId=$2"
                            r.query(query, [data.invoice_number, data.purchaseId], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        return res.status(200).json({ success: "Item successfuly removed" })
                                    } else {
                                        r.release()
                                        console.log('Request failed. Try again')
                                        return res.status(200).json({ message: 'Request failed. Try again' })
                                    }
                                }

                            })
                        } else {
                            r.release()
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }

                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})






router.post('/remove_credit_purchase', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Add to Cart', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number FROM tb_credit_sale_invoice WHERE invoice_number=$1 '
                r.query(query, [data.invoice_number], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            query = " DELETE FROM tb_credit_saletemp WHERE invoice_number=$1 AND purchaseId=$2"
                            r.query(query, [data.invoice_number, data.purchaseId], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        console.log('removed')
                                        return res.status(200).json({ success: "Item successfuly removed" })
                                    } else {
                                        r.release()
                                        console.log('Request failed. Try again')
                                        return res.status(200).json({ message: 'Request failed. Try again' })
                                    }
                                }

                            })
                        } else {
                            r.release()
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }

                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



router.post('/getAllinvoice', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Add to Cart', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number,customername,telephone FROM tb_cashsale_invoices'
                r.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }

                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/getAll_CREDIT_invoice', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Add to Cart', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number,customername,telephone FROM tb_credit_sale_invoice'
                r.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }

                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})

// 
router.post('/openInvoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Cashe Sales', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_cashsale_invoices  WHERE invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            res.status(200).json({ message: 'Invoice Already registered' })
                        } else {
                            query = "INSERT INTO tb_cashsale_invoices(invoice_number, dateposted, customername, emailadress, address, customertype,telephone,customerid,preparedby)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone, data.cutomerNumber, data.preparedBy], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        res.status(200).json({ success: 'Invoice successfuly created. Procceed to add products' })
                                    } else {
                                        r.release()
                                        res.status(200).json({ success: 'An error has occured. Try Again!' })
                                    }
                                }
                            })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/submitInvoice', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {

        if (r._connected) {
            try {
                query = "SELECT invoice_number,productid,brand,quantity,unitprice,purchaseid,customertype,totalcost,store_number,sales_type FROM tb_cash_sale_temp WHERE invoice_number = $1"
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {

                        if (results.rows.length > 0) {
                            const rws = results.rows

                            var counter = 0
                            r.query('BEGIN')
                            while (counter < rws.length) {
                                console.log('Inserting into cache sales invoices')
                                query = 'INSERT INTO  tb_cash_sales(invoice_number,product_number,purchaseid,product_brand,quantity_sold,unit_price,total_price,dateposted,store_number)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                r.query(query, [rws[counter].invoice_number, rws[counter].productid, rws[counter].purchaseid, rws[counter].brand, rws[counter].quantity, rws[counter].unitprice, rws[counter].totalcost, new Date(), rws[counter].store_number], (error, results) => {
                                    if (error) {
                                        r.query('ROLLBACK')
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (counter === rws.length) {
                                            // sumInvoiceTotal = sumInvoiceTotal + rws[counter].totalcost
                                            // console.log(rws[counter].totalcost)
                                        }
                                    }
                                })
                                counter++
                            }
                            query = 'SELECT invoice_number FROM invoice_summaries WHERE invoice_number=$1'
                            r.query(query, [data.invoceNumber], (error, results) => {
                                if (error) {
                                    console.log('errors')
                                    console.log(error)
                                    r.release()
                                    r.query('ROLLBACK')
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rows.length > 0) {
                                        res.release()
                                        r.query('ROLLBACK')
                                        return res.status(200).json({ message: 'Invoice already submitted' })
                                    } else {
                                        console.log('inserting into invoice summaries', rws[0].store_number)

                                        counter = 0

                                        query = 'INSERT INTO invoice_summaries(invoice_number,invoice_total,dateposted,sales_type,payment_progress,store_number)VALUES($1,$2,$3,$4,$5,$6)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, new Date(), data.salesObject, 'NO_PAYMENT_MADE', rws[0].store_number], (error, results) => {
                                            if (error) {
                                                console.log('Error==== ', error)
                                                r.release()
                                                r.query('ROLLBACK')
                                                return res.status(201).json({ message: error })
                                            } else {
                                                if (results.rowCount > 0) {
                                                    query = 'UPDATE tb_cashsale_invoices SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                    r.query(query, [true, data.invoceNumber], (error, results) => {
                                                        if (error) {
                                                            console.log(error)
                                                            r.release()
                                                            r.query('ROLLBACK')
                                                        } else {
                                                            if (results.rowCount > 0) {
                                                                query = 'UPDATE  tb_cash_sales SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                                r.query(query, [true, data.invoceNumber], (error, results) => {
                                                                    if (error) {
                                                                        console.log(error)
                                                                        r.release()
                                                                        r.query('ROLLBACK')
                                                                    } else {
                                                                        if (results.rowCount > 0) {
                                                                            query = 'DELETE FROM tb_cash_sale_temp WHERE invoice_number=$1'
                                                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                                                if (error) {
                                                                                    console.log(error)
                                                                                    r.release()
                                                                                    r.query('ROLLBACK')
                                                                                } else {
                                                                                    query = 'INSERT INTO tb_all_sales_invoices (sales_type,invoice_number,date_posted,auth) VALUES ($1,$2,$3,$4)'
                                                                                    r.query(query, [data.salesObject, data.invoceNumber, new Date(), true], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log(error)
                                                                                            r.release()
                                                                                            r.query('ROLLBACK')
                                                                                        } else {
                                                                                            r.release()
                                                                                            r.query('COMMIT')
                                                                                            return res.status(200).json({ success: 'Invoice submitted successfuly' })
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            res.release()
                                                                            r.query('ROLLBACK')
                                                                            return res.status(200).json({ message: 'Unable to update cashes sales tables' })
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                res.release()
                                                                r.query('ROLLBACK')
                                                                return res.status(200).json({ message: 'Unable to close the invoice' })
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
                            r.query('ROLLBACK')
                            r.release()
                            return res.status(200).json({ message: 'Invoice does not exist' })
                        }
                    }
                })

            } catch (error) {
                console.log(error)
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



//credit purchase queries



router.post('/loadcreditTempSales', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers

    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT tb_credit_saletemp.invoice_number,tb_credit_saletemp.purchaseid,tb_credit_saletemp.ProductId,tb_credit_saletemp.brand,tb_credit_saletemp.quantity,tb_credit_saletemp.unitprice,tb_credit_saletemp.totalcost, productbrand.title,products.name,stores.storename FROM tb_credit_saletemp LEFT JOIN  products ON  tb_credit_saletemp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_credit_saletemp.brand=productbrand.brandid LEFT JOIN stores ON tb_credit_saletemp.store_number=stores.storenumber  WHERE tb_credit_saletemp.invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            let rws = results.rows
                            query = 'SELECT SUM(totalcost) AS total FROM tb_credit_saletemp WHERE invoice_number = $1'
                            r.query(query, [data.invoceNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(201).json({ message: error })
                                } else {

                                    if (results.rows.length > 0) {
                                        console.log(rws)
                                        return res.status(200).json({ data: rws, sumtotal: results.rows })
                                    } else {
                                        console.log('failed')
                                        return res.status(201).json({ message: 'Unable to sum totals' })
                                    }
                                }
                            })

                            // 
                        } else {
                            console.log('node foun')
                            res.status(201).json({ message: 'Temp container is empty' })
                        }
                    }
                })

            } catch (error) {
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})


router.post('/AddcreditCart', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log('Credit temp', data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number FROM tb_credit_sale_invoice WHERE invoice_number=$1 '
                r.query(query, [data.invoiceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            query = "INSERT INTO tb_credit_saletemp(invoice_number,productid,brand,quantity,unitprice,totalcost,purchaseid,customertype,store_number,sales_type)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
                            r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.purchaseId, data.customerType, data.storeNumber, data.salesObject], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        return res.status(200).json({ success: "Request success" })
                                    } else {
                                        r.release()
                                        console.log('Request failed. Try again')
                                        return res.status(200).json({ message: 'Request failed. Try again' })
                                    }
                                }

                            })
                        } else {
                            r.release()
                            console.log('Invoice has not been initiated. Initiate and Invoice and continue')
                            return res.status(200).json({ message: 'Invoice has not been initiated. Initiate and Invoice and continue' })
                        }
                    }
                })
            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



// 
router.post('/opencreditInvoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_credit_sale_invoice  WHERE invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            res.status(200).json({ message: 'Invoice Already registered' })
                        } else {
                            query = "INSERT INTO tb_credit_sale_invoice(invoice_number, dateposted, customername, emailaddress, address, customertype,telephone,customerid,preparedby)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone, data.cutomerNumber, data.preparedBy], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.release()
                                        res.status(200).json({ success: 'Invoice successfuly created. Procceed to add products' })
                                    } else {
                                        r.release()
                                        res.status(200).json({ success: 'An error has occured. Try Again!' })
                                    }
                                }
                            })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/submitcreditInvoice', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {

        if (r._connected) {
            try {
                query = "SELECT invoice_number,productid,brand,quantity,unitprice,purchaseid,customertype,totalcost  FROM tb_credit_saletemp WHERE invoice_number = $1"
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        console.log(results.rows)
                        if (results.rows.length > 0) {
                            const rws = results.rows

                            var counter = 0
                            r.query('BEGIN')
                            while (counter < rws.length) {
                                query = 'INSERT INTO  tb_credit_sales(invoice_number,product_number,purchaseid,product_brand,quantity_sold,unit_price,total_price,dateposted)VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
                                r.query(query, [rws[counter].invoice_number, rws[counter].productid, rws[counter].purchaseid, rws[counter].brand, rws[counter].quantity, rws[counter].unitprice, rws[counter].totalcost, new Date()], (error, results) => {
                                    if (error) {
                                        r.query('ROLLBACK')
                                        console.log(error)
                                        return res.status(201).json({ message: error })
                                    } else {
                                        if (counter === rws.length) {
                                            // sumInvoiceTotal = sumInvoiceTotal + rws[counter].totalcost
                                            // console.log(rws[counter].totalcost)
                                        }
                                    }
                                })
                                counter++
                            }
                            query = 'SELECT invoice_number FROM tb_credit_invoice_summary WHERE invoice_number=$1'
                            r.query(query, [data.invoceNumber], (error, results) => {
                                if (error) {

                                    console.log(error)
                                    r.release()
                                    r.query('ROLLBACK')
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rows.length > 0) {
                                        res.release()
                                        r.query('ROLLBACK')
                                        return res.status(200).json({ message: 'Invoice already submitted' })
                                    } else {
                                        query = 'INSERT INTO tb_credit_invoice_summary(invoice_number,invoice_total,dateposted,payment_progress)VALUES($1,$2,$3,$4)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, new Date(), 'NO_PAYMENT_MADE'], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                r.query('ROLLBACK')
                                                return res.status(201).json({ message: error })
                                            } else {
                                                if (results.rowCount > 0) {
                                                    query = 'UPDATE tb_credit_sale_invoice SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                    r.query(query, [true, data.invoceNumber], (error, results) => {
                                                        if (error) {
                                                            console.log(error)
                                                            r.release()
                                                            r.query('ROLLBACK')
                                                        } else {
                                                            if (results.rowCount > 0) {
                                                                query = 'UPDATE  tb_credit_sales SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                                r.query(query, [true, data.invoceNumber], (error, results) => {
                                                                    if (error) {
                                                                        console.log(error)
                                                                        r.release()
                                                                        r.query('ROLLBACK')
                                                                    } else {
                                                                        if (results.rowCount > 0) {
                                                                            query = 'DELETE FROM tb_credit_saletemp WHERE invoice_number=$1'
                                                                            r.query(query, [data.invoceNumber], (error, results) => {
                                                                                if (error) {
                                                                                    console.log(error)
                                                                                    r.release()
                                                                                    r.query('ROLLBACK')
                                                                                } else {
                                                                                    query = 'INSERT INTO tb_all_sales_invoices (sales_type,invoice_number,date_posted,auth) VALUES ($1,$2,$3,$4)'
                                                                                    r.query(query, [data.salesObject, data.invoceNumber, new Date(), true], (error, results) => {
                                                                                        if (error) {
                                                                                            console.log(error)
                                                                                            r.release()
                                                                                            r.query('ROLLBACK')
                                                                                        } else {
                                                                                            r.release()
                                                                                            r.query('COMMIT')
                                                                                            return res.status(200).json({ success: 'Invoice submitted successfuly' })
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            res.release()
                                                                            r.query('ROLLBACK')
                                                                            return res.status(200).json({ message: 'Unable to update cashes sales tables' })
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                res.release()
                                                                r.query('ROLLBACK')
                                                                return res.status(200).json({ message: 'Unable to close the invoice' })
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
                            r.query('ROLLBACK')
                            r.release()
                            return res.status(200).json({ message: 'Invoice does not exist' })
                        }
                    }
                })

            } catch (error) {
                console.log(error)
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})







// 


router.post('/loadInvoiceQuote', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Cashe Sales', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_all_sales_invoices  WHERE invoice_number=$1  "
                r.query(query, [data.invoinceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            const rws = results.rows[0].sales_type.trim()
                            console.log('Sales type', rws)
                            switch (rws) {
                                case "CASH_SALES":
                                 
                                    query = "SELECT invoice_summaries.invoice_number,invoice_summaries.payment_progress, invoice_summaries.invoice_total,invoice_summaries.dateposted, invoice_summaries.isinvoice_verified, invoice_summaries.sales_type," +
                                        "  tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address " +
                                        " FROM invoice_summaries LEFT JOIN tb_cashsale_invoices ON invoice_summaries.invoice_number = tb_cashsale_invoices.invoice_number WHERE invoice_summaries.invoice_number=$1  "
                                    r.query(query, [data.invoinceNumber], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rows.length > 0) {
                                                const invoicesum = results.rows
                                                query = "SELECT tb_cash_sales.quantity_sold,tb_cash_sales.unit_price, tb_cash_sales.total_price,tb_cash_sales.store_number, products.name,productbrand.title FROM tb_cash_sales LEFT JOIN products ON tb_cash_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand = productbrand.brandid WHERE tb_cash_sales.invoice_number=$1  "
                                                r.query(query, [data.invoinceNumber], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                        if (results.rows.length > 0) {
                                                            const invoiceitems = results.rows
                                                            query = 'SELECT * FROM payment_history WHERE invoice_number=$1 AND is_current=$2'
                                                            r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error.hint })
                                                                } else {
                                                                    if (results.rows.length > 0) {
                                                                        r.release()
                                                                                 console.log('Loading cashe sales...............')
                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: results.rows, isQuote: true })
                                                                    } else {
                                                                        r.release()

                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: [{ balance: 'undefined' }], isQuote: true })
                                                                    }
                                                                }

                                                            })

                                                        } else {
                                                            r.release()
                                                            res.status(200).json({ message: 'Invoice quote not found' })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.release()
                                                res.status(200).json({ message: 'Invoice records not found' })
                                            }
                                        }
                                    })

                                    break;
                                case "CREDIT_SALES":
                                    query = "SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.payment_progress, tb_credit_invoice_summary.invoice_total, tb_credit_invoice_summary.dateposted, tb_credit_invoice_summary.isinvoice_verified, tb_credit_invoice_summary.sales_type, tb_credit_sale_invoice.customername, tb_credit_sale_invoice.telephone, tb_credit_sale_invoice.emailaddress, tb_credit_sale_invoice.address FROM tb_credit_invoice_summary LEFT JOIN tb_credit_sale_invoice ON tb_credit_invoice_summary.invoice_number = tb_credit_sale_invoice.invoice_number WHERE tb_credit_invoice_summary.invoice_number=$1  "
                                    r.query(query, [data.invoinceNumber], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rows.length > 0) {
                                                console.log(results.rows)
                                                const invoicesum = results.rows
                                                query = "SELECT tb_credit_sales.quantity_sold,tb_credit_sales.unit_price, tb_credit_sales.total_price,tb_credit_sales.store_number, products.name,productbrand.title FROM tb_credit_sales LEFT JOIN products ON tb_credit_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand = productbrand.brandid WHERE tb_credit_sales.invoice_number=$1  "
                                                r.query(query, [data.invoinceNumber], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                        if (results.rows.length > 0) {
                                                            const invoiceitems = results.rows
                                                            query = 'SELECT * FROM payment_history WHERE invoice_number=$1'
                                                            r.query(query, [data.invoinceNumber], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error.hint })
                                                                } else {
                                                                    if (results.rows.length > 0) {
                                                                        r.release()
                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: results.rows, isQuote: true })
                                                                    } else {
                                                                        r.release()

                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: [{ balance: 'undefined' }], isQuote: true })
                                                                    }
                                                                }

                                                            })
                                                        } else {
                                                            r.release()
                                                            res.status(200).json({ message: 'Invoice quote not found' })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.release()
                                                res.status(200).json({ message: 'Invoice records not found' })
                                            }
                                        }
                                    })

                                    break;
                                default: res.status(201).json({ message: 'Unable to determine sales type' })
                            }

                        } else {
                            r.release()
                            console.log('Invoice not found')
                            res.status(200).json({ message: 'Invoice not found****' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})

// makePayment


router.post('/makePayment', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log(data)
        if (r._connected) {
            try {
                let type = data.salesType
                switch (type) {
                    case "CASH_SALES":
                        query = 'UPDATE invoice_summaries SET isinvoice_verified=$1,payment_progress=$2,is_payment_complete=$3  WHERE invoice_number=$4 '
                        r.query(query, [true, data.payment_progress, data.isFullpayment, data.invoinceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = "UPDATE tb_cash_sales  SET isinvoice_verified=$1 WHERE invoice_number=$2"
                                    r.query(query, [true, data.invoinceNumber], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {

                                                query = "SELECT is_current FROM payment_history WHERE invoice_number=$1"
                                                r.query(query, [data.invoinceNumber], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        r.release()
                                                        return res.status(201).json({ message: error })
                                                    } else {
                                                        if (results.rows.length > 0) {
                                                            query = 'UPDATE payment_history SET is_current=$1 WHERE invoice_number=$2 '
                                                            r.query(query, [false, data.invoinceNumber], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    query = 'INSERT INTO payment_history(payment_number,invoice_number,sales_type,amount_paid,balance,date_paid,date_posted,isverified,is_current)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                                                    r.query(query, [data.paymentNumber, data.invoinceNumber, data.salesType, data.amountPaid, data.balance, new Date(), new Date(), true, true], (error, results) => {
                                                                        if (error) {
                                                                            console.log(error)
                                                                            r.release()
                                                                            return res.status(201).json({ message: error })
                                                                        } else {
                                                                            if (results.rowCount > 0) {
                                                                                r.release()
                                                                                return res.status(200).json({ success: "Request success" })
                                                                            } else {
                                                                                r.release()
                                                                                console.log('Request failed. Try again')
                                                                                return res.status(200).json({ message: 'Request failed to update payment history' })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            query = 'INSERT INTO payment_history(payment_number,invoice_number,sales_type,amount_paid,balance,date_paid,date_posted,isverified,is_current)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                                            r.query(query, [data.paymentNumber, data.invoinceNumber, data.salesType, data.amountPaid, data.balance, new Date(), new Date(), true, true], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.release()
                                                                        return res.status(200).json({ success: "Request success" })
                                                                    } else {
                                                                        r.release()
                                                                        console.log('Request failed. Try again')
                                                                        return res.status(200).json({ message: 'Request failed to update payment history' })
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.release()
                                                console.log('Request failed. Try again')
                                                return res.status(200).json({ message: 'Request failed. Try again' })
                                            }
                                        }

                                    })
                                } else {
                                    r.release()
                                    console.log('Invoice has not been initiated. Initiate and Invoice and continue')
                                    return res.status(200).json({ message: 'Payment failed. Invoice has not been initiated.' })
                                }
                            }
                        })

                        break;
                    case "CREDIT_SALES":
                        query = 'UPDATE tb_credit_invoice_summary SET isinvoice_verified=$1,payment_progress=$2  WHERE invoice_number=$3 '
                        r.query(query, [true, data.payment_progress, data.invoinceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = "UPDATE tb_credit_sales  SET isinvoice_verified=$1 WHERE invoice_number=$2"
                                    r.query(query, [true, data.invoinceNumber], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                return res.status(200).json({ success: 'Request was successful' })
                                            } else {
                                                r.release()
                                                console.log('Request failed. Try again')
                                                return res.status(200).json({ message: 'Request failed. Try again' })
                                            }
                                        }

                                    })
                                } else {
                                    r.release()
                                    console.log('Invoice has not been initiated. Initiate and Invoice and continue')
                                    return res.status(200).json({ message: 'Payment failed. Invoice has not been initiated.' })
                                }
                            }
                        })
                        break;
                    default: return res.status(201).json({ message: 'This invoice is not available for verification' })
                }

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})







router.post('/loadPaymentReceipt', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Cashe Sales', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_all_sales_invoices  WHERE invoice_number=$1  "
                r.query(query, [data.invoinceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            const rws = results.rows[0].sales_type.trim()
                            console.log('Sales type', rws)
                            switch (rws) {
                                case "CASH_SALES":

                                    query = "SELECT invoice_summaries.invoice_number,invoice_summaries.payment_progress, invoice_summaries.invoice_total, invoice_summaries.dateposted, invoice_summaries.isinvoice_verified, invoice_summaries.sales_type, tb_cashsale_invoices.customername, tb_cashsale_invoices.telephone, tb_cashsale_invoices.emailadress, tb_cashsale_invoices.address FROM invoice_summaries LEFT JOIN tb_cashsale_invoices ON invoice_summaries.invoice_number = tb_cashsale_invoices.invoice_number WHERE invoice_summaries.invoice_number=$1  AND invoice_summaries.isinvoice_verified=$2  "
                                    r.query(query, [data.invoinceNumber, true], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rows.length > 0) {
                                                const invoicesum = results.rows
                                                console.log(invoicesum)
                                                query = "SELECT tb_cash_sales.quantity_sold,tb_cash_sales.unit_price, tb_cash_sales.total_price,tb_cash_sales.store_number, products.name,productbrand.title FROM tb_cash_sales LEFT JOIN products ON tb_cash_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand = productbrand.brandid WHERE tb_cash_sales.invoice_number=$1"
                                                r.query(query, [data.invoinceNumber], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                        console.log('cash', results.rows)
                                                        if (results.rows.length > 0) {

                                                            const invoiceitems = results.rows

                                                            query = 'SELECT SUM(amount_paid) AS sumpaid FROM  payment_history WHERE invoice_number=$1'
                                                            r.query(query, [data.invoinceNumber], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error.hint })
                                                                } else {
                                                                    if (results.rows.length > 0) {
                                                                        const sumpaid = results.rows

                                                                        query = 'SELECT * FROM payment_history WHERE invoice_number=$1 AND is_current=$2'
                                                                        r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                                            if (error) {
                                                                                console.log(error)
                                                                                r.release()
                                                                                return res.status(201).json({ message: error.hint })
                                                                            } else {
                                                                                if (results.rows.length > 0) {
                                                                                    r.release()
                                                                                    res.status(200).json({ invoicesum, invoiceitems, rws, balance: results.rows, sumpaid, isQuote: true })
                                                                                } else {
                                                                                    console.log('error in history payment')
                                                                                }
                                                                            }

                                                                        })

                                                                    } else {
                                                                        r.release()
                                                                        console.log('Error in summaery payment')
                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: [{ balance: 'undefined' }], sumpaid: [{ sumpaid: 'undefined' }], isQuote: true })
                                                                    }
                                                                }
                                                            })


                                                        } else {
                                                            r.release()
                                                            console.log('no invoice')
                                                            res.status(200).json({ message: 'Invoice quote not found' })
                                                        }
                                                    }
                                                })
                                            } else {
                                                console.log('No records found for cashe sales')
                                                r.release()
                                                res.status(200).json({ message: 'Invoice records not found' })
                                            }
                                        }
                                    })

                                    break;
                                case "CREDIT_SALES":

                                    query = "SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.payment_progress, tb_credit_invoice_summary.invoice_total, tb_credit_invoice_summary.dateposted, tb_credit_invoice_summary.isinvoice_verified, tb_credit_invoice_summary.sales_type, tb_credit_sale_invoice.customername, tb_credit_sale_invoice.telephone, tb_credit_sale_invoice.emailaddress, tb_credit_sale_invoice.address FROM tb_credit_invoice_summary LEFT JOIN tb_credit_sale_invoice ON tb_credit_invoice_summary.invoice_number = tb_credit_sale_invoice.invoice_number WHERE tb_credit_invoice_summary.invoice_number=$1 AND tb_credit_invoice_summary.isinvoice_verified=$2 AND full_payment=$3 "
                                    r.query(query, [data.invoinceNumber, true, false], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rows.length > 0) {
                                                console.log(results.rows)
                                                const invoicesum = results.rows
                                                query = "SELECT tb_credit_sales.quantity_sold,tb_credit_sales.unit_price, tb_credit_sales.total_price,tb_credit_sales.store_number, products.name,productbrand.title FROM tb_credit_sales LEFT JOIN products ON tb_credit_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand = productbrand.brandid WHERE tb_credit_sales.invoice_number=$1 AND isinvoice_verified=$2 "
                                                r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                        if (results.rows.length > 0) {
                                                            const invoiceitems = results.rows
                                                            r.release()
                                                            res.status(200).json({ invoicesum, invoiceitems, rws, sumpaid: [{ sumpaid: '0' }], isQuote: true })
                                                        } else {
                                                            r.release()
                                                            res.status(200).json({ message: 'Invoice quote not found' })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.release()
                                                res.status(200).json({ message: 'Invoice records not found' })
                                            }
                                        }
                                    })

                                    break;
                                default: res.status(201).json({ message: 'Unable to determine sales type' })
                            }

                        } else {
                            r.release()
                            console.log('Invoice not found')
                            res.status(200).json({ message: 'Invoice not found****' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



// 







router.post('/loadcreditInvoices', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Cashe Sales', data)
    await pool.connect().then(async (r) => {

        query = "SELECT * FROM tb_all_sales_invoices  WHERE invoice_number=$1  "
        r.query(query, [data.invoinceNumber], (error, results) => {
            if (error) {
                r.release()
                console.log(error)
                return res.status(201).json({ message: error })
            } else {
                if (results.rows.length > 0) {
                    const rws = results.rows[0].sales_type.trim()
                    console.log('Sales type', rws)
                    query = "SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.payment_progress, tb_credit_invoice_summary.invoice_total,tb_credit_invoice_summary.dateposted, tb_credit_invoice_summary.isinvoice_verified, tb_credit_invoice_summary.sales_type," +
                        "  tb_credit_sale_invoice.customername, tb_credit_sale_invoice.telephone, tb_credit_sale_invoice.emailaddress, tb_credit_sale_invoice.address " +
                        " FROM tb_credit_invoice_summary LEFT JOIN tb_credit_sale_invoice ON tb_credit_invoice_summary.invoice_number = tb_credit_sale_invoice.invoice_number WHERE tb_credit_invoice_summary.invoice_number=$1 "
                    r.query(query, [data.invoinceNumber], (error, results) => {
                        if (error) {
                            console.log(error)
                            r.release()
                            return res.status(201).json({ message: error })
                        } else {
                            if (results.rows.length > 0) {
                                const invoicesum = results.rows
                                query = "SELECT tb_credit_sales.quantity_sold,tb_credit_sales.unit_price, tb_credit_sales.total_price,tb_credit_sales.store_number, products.name,productbrand.title FROM tb_credit_sales LEFT JOIN products ON tb_credit_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand = productbrand.brandid WHERE tb_credit_sales.invoice_number=$1  "
                                r.query(query, [data.invoinceNumber], (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        return res.status(201).json({ message: error.hint })
                                    } else {
                                        if (results.rows.length > 0) {
                                            const invoiceitems = results.rows
                                            query = 'SELECT * FROM payment_history WHERE invoice_number=$1 AND is_current=$2'
                                            r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                if (error) {
                                                    console.log(error)
                                                    r.release()
                                                    return res.status(201).json({ message: error.hint })
                                                } else {
                                                    if (results.rows.length > 0) {

                                                        let bal = results.rows

                                                        query = 'SELECT SUM(amount_paid) AS sumpaid FROM  payment_history WHERE invoice_number=$1'
                                                        r.query(query, [data.invoinceNumber], (error, results) => {
                                                            if (error) {
                                                                console.log(error)
                                                                return res.status(201).json({ message: error.hint })
                                                            } else {
                                                                if (results.rows.length > 0) {
                                                                    const sumpaid = results.rows

                                                                    r.release()
                                                                    res.status(200).json({ invoicesum, invoiceitems, rws, balance: bal, sumpaid, isQuote: true })
                                                                } else {
                                                                    r.release()

                                                                    res.status(200).json({ invoicesum, invoiceitems, sumpaid: [{ sumpaid: 'undefined' }], rws, balance: [{ balance: 'undefined' }], isQuote: true })
                                                                }
                                                            }

                                                        })

                                                    } else {
                                                        r.release()
                                                        res.status(200).json({ invoicesum, invoiceitems, rws, sumpaid: [{ sumpaid: 'undefined' }], balance: [{ balance: 'undefined' }], isQuote: true })
                                                    }
                                                }
                                            })
                                        } else {
                                            r.release()
                                            res.status(200).json({ message: 'Invoice records not found' })
                                        }
                                    }
                                })

                            } else {
                                r.release()
                                console.log('Invoice not found')
                                res.status(200).json({ message: 'Invoice not found****' })
                            }
                        }
                    })
                }
            }
        })

    })
})




router.post('/makecreditpayment', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log(data)
        if (r._connected) {
            try {
                let type = data.salesType
                switch (type) {
                    case "CREDIT_SALES":
                        query = 'UPDATE tb_credit_invoice_summary SET isinvoice_verified=$1,payment_progress=$2,is_payment_complete=$3  WHERE invoice_number=$4 '
                        r.query(query, [true, data.payment_progress, data.isFullpayment, data.invoinceNumber], (error, results) => {
                            if (error) {
                                console.log(error)
                                r.release()
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = "UPDATE tb_credit_sales  SET isinvoice_verified=$1 WHERE invoice_number=$2"
                                    r.query(query, [true, data.invoinceNumber], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {

                                                query = "SELECT is_current FROM payment_history WHERE invoice_number=$1"
                                                r.query(query, [data.invoinceNumber], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        r.release()
                                                        return res.status(201).json({ message: error })
                                                    } else {
                                                        if (results.rows.length > 0) {
                                                            query = 'UPDATE payment_history SET is_current=$1 WHERE invoice_number=$2 '
                                                            r.query(query, [false, data.invoinceNumber], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    query = 'INSERT INTO payment_history(payment_number,invoice_number,sales_type,amount_paid,balance,date_paid,date_posted,isverified,is_current)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                                                    r.query(query, [data.paymentNumber, data.invoinceNumber, data.salesType, data.amountPaid, data.balance, new Date(), new Date(), true, true], (error, results) => {
                                                                        if (error) {
                                                                            console.log(error)
                                                                            r.release()
                                                                            return res.status(201).json({ message: error })
                                                                        } else {
                                                                            if (results.rowCount > 0) {
                                                                                r.release()
                                                                                return res.status(200).json({ success: "Request success" })
                                                                            } else {
                                                                                r.release()
                                                                                console.log('Request failed. Try again')
                                                                                return res.status(200).json({ message: 'Request failed to update payment history' })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            query = 'INSERT INTO payment_history(payment_number,invoice_number,sales_type,amount_paid,balance,date_paid,date_posted,isverified,is_current)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
                                                            r.query(query, [data.paymentNumber, data.invoinceNumber, data.salesType, data.amountPaid, data.balance, new Date(), new Date(), true, true], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    r.release()
                                                                    return res.status(201).json({ message: error })
                                                                } else {
                                                                    if (results.rowCount > 0) {
                                                                        r.release()
                                                                        return res.status(200).json({ success: "Request success" })
                                                                    } else {
                                                                        r.release()
                                                                        console.log('Request failed. Try again')
                                                                        return res.status(200).json({ message: 'Request failed to update payment history' })
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            } else {
                                                r.release()
                                                console.log('Request failed. Try again')
                                                return res.status(200).json({ message: 'Request failed. Try again' })
                                            }
                                        }

                                    })
                                } else {
                                    r.release()
                                    console.log('Invoice has not been initiated. Initiate and Invoice and continue')
                                    return res.status(200).json({ message: 'Payment failed. Invoice has not been initiated.' })
                                }
                            }
                        })

                        break;

                    default: return res.status(201).json({ message: 'This invoice is not available for verification' })
                        break;
                }

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()

            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})





router.post('/loadCreditPaymentReceipt', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Cashe Sales', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_all_sales_invoices  WHERE invoice_number=$1  "
                r.query(query, [data.invoinceNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            const rws = results.rows[0].sales_type.trim()
                            console.log('Sales type', rws)
                            switch (rws) {
                                case "CREDIT_SALES":
                                    query = "SELECT tb_credit_invoice_summary.invoice_number,tb_credit_invoice_summary.payment_progress, tb_credit_invoice_summary.invoice_total, tb_credit_invoice_summary.dateposted, tb_credit_invoice_summary.isinvoice_verified, tb_credit_invoice_summary.sales_type, tb_credit_sale_invoice.customername, tb_credit_sale_invoice.telephone, tb_credit_sale_invoice.emailaddress, tb_credit_sale_invoice.address FROM tb_credit_invoice_summary LEFT JOIN tb_credit_sale_invoice ON tb_credit_invoice_summary.invoice_number = tb_credit_sale_invoice.invoice_number WHERE tb_credit_invoice_summary.invoice_number=$1  AND tb_credit_invoice_summary.isinvoice_verified=$2  "
                                    r.query(query, [data.invoinceNumber, true], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rows.length > 0) {
                                                const invoicesum = results.rows
                                                query = "SELECT tb_credit_sales.quantity_sold,tb_credit_sales.unit_price, tb_credit_sales.total_price,tb_credit_sales.store_number, products.name,productbrand.title FROM tb_credit_sales LEFT JOIN products ON tb_credit_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_credit_sales.product_brand = productbrand.brandid WHERE tb_credit_sales.invoice_number=$1   AND tb_credit_sales.isinvoice_verified=$2"
                                                r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                        console.log('cash', results.rows)
                                                        if (results.rows.length > 0) {

                                                            const invoiceitems = results.rows

                                                            query = 'SELECT SUM(amount_paid) AS sumpaid FROM  payment_history WHERE invoice_number=$1'
                                                            r.query(query, [data.invoinceNumber], (error, results) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(201).json({ message: error.hint })
                                                                } else {
                                                                    if (results.rows.length > 0) {
                                                                        const sumpaid = results.rows

                                                                        query = 'SELECT * FROM payment_history WHERE invoice_number=$1 AND is_current=$2'
                                                                        r.query(query, [data.invoinceNumber, true], (error, results) => {
                                                                            if (error) {
                                                                                console.log(error)
                                                                                r.release()
                                                                                return res.status(201).json({ message: error.hint })
                                                                            } else {
                                                                                if (results.rows.length > 0) {
                                                                                    r.release()
                                                                                    res.status(200).json({ invoicesum, invoiceitems, rws, balance: results.rows, sumpaid, isQuote: true })
                                                                                } else {
                                                                                    console.log('error in history payment')
                                                                                }
                                                                            }

                                                                        })

                                                                    } else {
                                                                        r.release()
                                                                        console.log('Error in summaery payment')
                                                                        res.status(200).json({ invoicesum, invoiceitems, rws, balance: [{ balance: 'undefined' }], sumpaid: [{ sumpaid: 'undefined' }], isQuote: true })
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            r.release()
                                                            console.log('no invoice')
                                                            res.status(200).json({ message: 'Invoice quote not found' })
                                                        }
                                                    }
                                                })
                                            } else {
                                                console.log('No records found for cashe sales')
                                                r.release()
                                                res.status(200).json({ message: 'Invoice records not found' })
                                            }
                                        }
                                    })

                                    break;

                                default: res.status(201).json({ message: 'Unable to determine sales type' })
                                    break;
                            }

                        } else {
                            r.release()
                            console.log('Invoice not found')
                            res.status(200).json({ message: 'Invoice not found****' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})




router.post('/prepared_cash_invoices', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        let data = req.body
        //    console.log(data)
        if (r._connected) {

            const customOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            let formattedDate = new Intl.DateTimeFormat('sv-SE', customOptions).format(data.dated)
            console.log();
            try {
                query = "SELECT tb_cashsale_invoices.invoice_number,tb_cashsale_invoices.dateposted,tb_cashsale_invoices.isinvoice_verified,tb_cashsale_invoices.customername,tb_cashsale_invoices.telephone,tb_cashsale_invoices.emailadress,tb_cashsale_invoices.address,tb_cashsale_invoices.invoice_submitted,tb_cashsale_invoices.customertype,tb_cashsale_invoices.customerid,tb_cashsale_invoices.preparedby,invoice_summaries.is_payment_complete " +
                    " FROM tb_cashsale_invoices LEFT JOIN invoice_summaries ON tb_cashsale_invoices.invoice_number=invoice_summaries.invoice_number  WHERE  tb_cashsale_invoices.dateposted=$1"

                r.query(query, [formattedDate], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            console.log(results.rows)
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            console.log('no invoice found')
                            res.status(201).json({ message: 'No invoice today' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            console.log('Database connection failed')
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})



router.post('/prepared_credit_invoices', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        let data = req.body
        //    console.log(data)
        if (r._connected) {

            const customOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            let formattedDate = new Intl.DateTimeFormat('sv-SE', customOptions).format(data.dated)
            console.log(new Intl.DateTimeFormat('sv-SE', customOptions).format(data.dated));
            try {
                query = "SELECT tb_credit_sale_invoice.invoice_number,tb_credit_sale_invoice.dateposted, tb_credit_sale_invoice.isinvoice_verified, tb_credit_sale_invoice.customername, tb_credit_sale_invoice.telephone, tb_credit_sale_invoice.emailaddress, tb_credit_sale_invoice.address, tb_credit_sale_invoice.invoice_submitted, tb_credit_sale_invoice.customertype, tb_credit_sale_invoice.customerid, tb_credit_sale_invoice.preparedby, tb_credit_invoice_summary.is_payment_complete" +
                    " FROM tb_credit_sale_invoice LEFT JOIN tb_credit_invoice_summary  ON tb_credit_sale_invoice.invoice_number=tb_credit_invoice_summary.invoice_number  WHERE  tb_credit_sale_invoice.dateposted=$1"

                r.query(query, [formattedDate], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            console.log(results.rows)
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            console.log('no invoice found')
                            res.status(201).json({ message: 'No invoice today' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            console.log('Database connection failed')
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})





router.post('/join_credit_cash_salse', cors({ origin: '*' }), async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        let data = req.body
        //    console.log(data)
        if (r._connected) {

            const customOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            let formattedDate = new Intl.DateTimeFormat('sv-SE', customOptions).format(data.dated)
            console.log(new Intl.DateTimeFormat('sv-SE', customOptions).format(data.dated));
            try {
                query = `SELECT 
                            ca.invoice_number, ca.product_number, ca.purchaseid, ca.product_brand, 
                            ca.quantity_sold, ca.unit_price, ca.total_price, ca.dateposted,  
                            ca.isinvoice_verified, ca.isinvoice_paid, ca.datepaid, 
                            ca.invoice_submitted, ca.store_number, ca.store_verified,
                            st.storename, p.name, br.title, asi.sales_type 
                        FROM tb_cash_sales ca
                        LEFT JOIN stores st ON st.storenumber = ca.store_number
                        LEFT JOIN products p ON p.serialnumber = ca.product_number
                        LEFT JOIN productbrand br ON br.brandid = ca.product_brand
                        LEFT JOIN tb_all_sales_invoices asi ON ca.invoice_number=asi.invoice_number
                        WHERE ca.dateposted = $1  

                        UNION

                        SELECT 
                            cr.invoice_number, cr.product_number, cr.purchaseid, cr.product_brand, 
                            cr.quantity_sold, cr.unit_price, cr.total_price, cr.dateposted,  
                            cr.isinvoice_verified, cr.isinvoice_paid, cr.datepaid, 
                            cr.invoice_submitted, cr.store_number, cr.store_verified,
                            st.storename, p.name, br.title, asi.sales_type  
                        FROM tb_credit_sales cr 
                        LEFT JOIN stores st ON st.storenumber = cr.store_number 
                        LEFT JOIN products p ON p.serialnumber = cr.product_number
                        LEFT JOIN productbrand br ON br.brandid = cr.product_brand
                        LEFT JOIN tb_all_sales_invoices asi ON cr.invoice_number=asi.invoice_number 
                        WHERE cr.dateposted = $1; `;

                r.query(query, [formattedDate], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            console.log(results.rows)
                            r.release()
                            return res.status(200).json({ data: results.rows })
                        } else {
                            r.release()
                            console.log('no invoice found')
                            res.status(201).json({ message: 'No invoice today' })
                        }
                    }
                })

            } catch (error) {
                r.release()
                return res.status(201).json({ message: error })
                console.log(error)
            }
        } else {
            r.release()
            console.log('Database connection failed')
            return res.status(201).json({ message: 'Database Connection failed' })
        }
    })
})


module.exports = router
