const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
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
                query = "SELECT cashsaletemp.invoice_number,cashsaletemp.purchaseid,cashsaletemp.ProductId,cashsaletemp.brand,cashsaletemp.quantity,cashsaletemp.unitprice,cashsaletemp.totalcost, productbrand.title,products.name FROM cashsaletemp LEFT JOIN  products ON  cashsaletemp.ProductId=products.serialnumber LEFT JOIN productbrand ON cashsaletemp.brand=productbrand.brandid  WHERE cashsaletemp.invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            let rws = results.rows
                            query = 'SELECT SUM(totalcost) AS total FROM cashsaletemp WHERE invoice_number = $1'
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
        console.log(data)
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

                            query = "SELECT * FROM cashsaletemp WHERE productid = $1 AND brand = $2"
                            r.query(query, [data.productId, data.brandId], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rows.length > 0) {

                                        return res.status(200).json({ message: 'Product already added to list' })
                                    } else {
                                        query = "SELECT * FROM cashsaletemp  WHERE purchaseid=$1  "
                                        r.query(query, [data.purchaseId], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                return res.status(201).json({ message: error })
                                            } else {
                                                if (results.rows.length > 0) {
                                                    return res.status(200).json({ message: 'Purchase Number already added to list' })
                                                } else {
                                                    query = "INSERT INTO cashsaletemp(invoice_number,productid,brand,quantity,unitprice,totalcost,purchaseid,customertype)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                    r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.purchaseId, data.customerType], (error, results) => {
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
                                                }
                                            }
                                        })
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
router.post('/openInvoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log(data)
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
                            query = "INSERT INTO tb_cashsale_invoices(invoice_number, dateposted, customername, emailadress, addresss, customertype,telephone,cutomerid)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone,data.cutomerNumber], (error, results) => {
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
                query = "SELECT invoice_number,productid,brand,quantity,unitprice,purchaseid,customertype,totalcost  FROM cashsaletemp WHERE invoice_number = $1"
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
                                query = 'INSERT INTO  tb_cahesales(invoice_number,product_number,purchaseid,product_brand,quatity_sold,unit_price,total_price,dateposted)VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
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
                            query = 'SELECT invoice_number FROM invoice_summaeries WHERE invoice_number=$1'
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
                                        query = 'INSERT INTO invoice_summaeries(invoice_number,invoice_total,invoice_balance,dateposted)VALUES($1,$2,$3,$4)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, data.sumInvoiceTotal, new Date()], (error, results) => {
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
                                                                query = 'UPDATE  tb_cahesales SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                                r.query(query, [true,data.invoceNumber], (error, results) => {
                                                                    if (error) {
                                                                        console.log(error)
                                                                        r.release()
                                                                        r.query('ROLLBACK')
                                                                    } else {
                                                                        if (results.rowCount > 0) {
                                                                            query = 'DELETE FROM cashsaletemp WHERE invoice_number=$1'
                                                                            r.query(query, [data.invoceNumber], (error, results) => {
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
                query = 'SELECT invoice_number FROM tb_credit_sale_invoices WHERE invoice_number=$1 '
                r.query(query, [data.invoiceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            query = "SELECT * FROM tb_credit_saletemp WHERE productid = $1 AND brand = $2"
                            r.query(query, [data.productId, data.brandId], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rows.length > 0) {

                                        return res.status(200).json({ message: 'Product already added to list' })
                                    } else {
                                        query = "SELECT * FROM tb_credit_saletemp  WHERE purchaseid=$1  "
                                        r.query(query, [data.purchaseId], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                return res.status(201).json({ message: error })
                                            } else {
                                                if (results.rows.length > 0) {
                                                    return res.status(200).json({ message: 'Purchase Number already added to list' })
                                                } else {
                                                    query = "INSERT INTO tb_credit_saletemp(invoice_number,productid,brand,quantity,unitprice,totalcost,purchaseid,customertype)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                                                    r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.purchaseId, data.customerType], (error, results) => {
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
                                                }
                                            }
                                        })
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
                query = "SELECT * FROM tb_credit_sale_invoices  WHERE invoice_number=$1  "
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
                            query = "INSERT INTO tb_credit_sale_invoices(invoice_number, dateposted, customername, emailadress, addresss, customertype,telephone,cutomerid)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
                            r.query(query, [data.invoiceNumber, data.dateposted, data.customername, data.emailadress, data.addresss, data.customerType, data.telephone,data.cutomerNumber], (error, results) => {
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
                                query = 'INSERT INTO  tb_credit_sales(invoice_number,product_number,purchaseid,product_brand,quatity_sold,unit_price,total_price,dateposted)VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
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
                            query = 'SELECT invoice_number FROM credit_invoice_summaeries WHERE invoice_number=$1'
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
                                        query = 'INSERT INTO credit_invoice_summaeries(invoice_number,invoice_total,invoice_balance,dateposted)VALUES($1,$2,$3,$4)'
                                        r.query(query, [data.invoceNumber, data.sumInvoiceTotal, data.sumInvoiceTotal, new Date()], (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                r.release()
                                                r.query('ROLLBACK')
                                                return res.status(201).json({ message: error })
                                            } else {
                                                if (results.rowCount > 0) {
                                                    query = 'UPDATE tb_credit_sale_invoices SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                    r.query(query, [true, data.invoceNumber], (error, results) => {
                                                        if (error) {
                                                            console.log(error)
                                                            r.release()
                                                            r.query('ROLLBACK')
                                                        } else {
                                                            if (results.rowCount > 0) {
                                                                query = 'UPDATE  tb_credit_sales SET invoice_submitted=$1 WHERE invoice_number=$2'
                                                                r.query(query, [true,data.invoceNumber], (error, results) => {
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

                                                                                    r.release()
                                                                                    r.query('COMMIT')
                                                                                    return res.status(200).json({ success: 'Invoice submitted successfuly' })
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
module.exports = router

