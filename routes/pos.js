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
                query = "SELECT  products.serialnumber, products.name, productbrand.brandid,productbrand.title,productbrand.imageurl,productbrand.role, productprice.unitesellingprice, " +
                    " rretail_stock_summeries.store_id,rretail_stock_summeries.total_quantity,stores.storename FROM products LEFT JOIN productbrand ON  products.serialnumber=productbrand.productid " +
                    "LEFT JOIN rretail_stock_summeries ON productbrand.brandid=rretail_stock_summeries.stock_brand LEFT JOIN stores ON rretail_stock_summeries.store_id=stores.storenumber LEFT JOIN productprice ON productprice.brandid=productbrand.brandid  WHERE is_stock_opened=$1  "
                r.query(query, [true], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            return res.status(200).json({ data: results.rows })
                        } else {
                            console.log('node foun')
                            res.status(201).json({ message: 'No products found' })
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


router.post('/loadTempSales', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers

    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT tb_cash_sale_temp.invoice_number,tb_cash_sale_temp.purchaseid,tb_cash_sale_temp.ProductId,tb_cash_sale_temp.brand,tb_cash_sale_temp.quantity,tb_cash_sale_temp.unitprice,tb_cash_sale_temp.totalcost, productbrand.title,products.name FROM tb_cash_sale_temp LEFT JOIN  products ON  tb_cash_sale_temp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_cash_sale_temp.brand=productbrand.brandid  WHERE tb_cash_sale_temp.invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            let rws = results.rows
                            query = 'SELECT SUM(totalcost) AS total FROM tb_cash_sale_temp WHERE invoice_number = $1'
                            r.query(query, [data.invoceNumber], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(201).json({ message: error })
                                } else {

                                    if (results.rows.length > 0) {
                                        console.log(results.rows)
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
                            res.status(201).json({ message: 'No products found' })
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
                            query = "INSERT INTO tb_cashsale_invoices(invoice_number, dateposted, customername, emailadress, address, customertype,telephone,customerid)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone, data.cutomerNumber], (error, results) => {
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
                        console.log(results.rows)
                        if (results.rows.length > 0) {
                            const rws = results.rows

                            var counter = 0
                            r.query('BEGIN')
                            while (counter < rws.length) {
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
                                        query = 'INSERT INTO invoice_summaries(invoice_number,invoice_total,dateposted,sales_type,payment_progress)VALUES($1,$2,$3,$4,$5)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, new Date(), data.salesObject,'NO_PAYMENT_MADE'], (error, results) => {
                                            if (error) {
                                                console.log(error)
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
                query = "SELECT tb_credit_saletemp.invoice_number,tb_credit_saletemp.purchaseid,tb_credit_saletemp.ProductId,tb_credit_saletemp.brand,tb_credit_saletemp.quantity,tb_credit_saletemp.unitprice,tb_credit_saletemp.totalcost, productbrand.title,products.name FROM tb_credit_saletemp LEFT JOIN  products ON  tb_credit_saletemp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_credit_saletemp.brand=productbrand.brandid  WHERE tb_credit_saletemp.invoice_number=$1  "
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
                                        console.log(results.rows)
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
                            res.status(201).json({ message: 'No products found' })
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
        console.log(data)
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
                            query = "INSERT INTO tb_credit_saletemp(invoice_number,productid,brand,quantity,unitprice,totalcost,purchaseid,customertype,store_number)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
                            r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.purchaseId, data.customerType, data.storeNumber], (error, results) => {
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
                            query = "INSERT INTO tb_credit_sale_invoice(invoice_number, dateposted, customername, emailaddress, address, customertype,telephone,customerid)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone, data.cutomerNumber], (error, results) => {
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
                                        query = 'INSERT INTO tb_credit_invoice_summary(invoice_number,invoice_total,dateposted,payment_progress)VALUES($1,$2,$3,$4,$5)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, new Date(),'NO_PAYMENT_MADE'], (error, results) => {
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
                        r.query(query, [true, data.payment_progress,data.isFullpayment, data.invoinceNumber], (error, results) => {
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
                        r.query(query, [true, data.payment_progress,data.invoinceNumber], (error, results) => {
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
                                                query = "SELECT tb_cash_sales.quantity_sold,tb_cash_sales.unit_price, tb_cash_sales.total_price,tb_cash_sales.store_number, products.name,productbrand.title FROM tb_cash_sales LEFT JOIN products ON tb_cash_sales.product_number = products.serialnumber LEFT JOIN productbrand ON tb_cash_sales.product_brand = productbrand.brandid WHERE tb_cash_sales.invoice_number=$1 AND isinvoice_paid=$2  AND isinvoice_verified=$3"
                                                r.query(query, [data.invoinceNumber, true, true], (error, results) => {
                                                    if (error) {
                                                        console.log(error)
                                                        return res.status(201).json({ message: error.hint })
                                                    } else {
                                                                  console.log('cash',results.rows)
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
                                                            res.status(200).json({ invoicesum, invoiceitems, rws,sumpaid:[{sumpaid:'0'}], isQuote: true })
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

module.exports = router

