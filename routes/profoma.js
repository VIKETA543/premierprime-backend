const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()




router.post('/promomatemp', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers

    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT tb_profoma_temp.invoice_number,tb_profoma_temp.ProductId,tb_profoma_temp.brand,tb_profoma_temp.quantity,tb_profoma_temp.unitprice,tb_profoma_temp.totalcost, productbrand.title,products.name FROM tb_profoma_temp LEFT JOIN  products ON  tb_profoma_temp.ProductId=products.serialnumber LEFT JOIN productbrand ON tb_profoma_temp.brand=productbrand.brandid  WHERE tb_profoma_temp.invoice_number=$1  "
                r.query(query, [data.invoceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            let rws = results.rows
                            query = 'SELECT SUM(totalcost) AS total FROM tb_profoma_temp WHERE invoice_number = $1'
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


router.post('/profomacart', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {
        console.log(data)
        if (r._connected) {
            try {
                query = 'SELECT invoice_number FROM tb_profoma_invoices WHERE invoice_number=$1 '
                r.query(query, [data.invoiceNumber], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {

                            query = "SELECT * FROM tb_profoma_temp WHERE productid = $1 AND brand = $2"
                            r.query(query, [data.productId, data.brandId], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rows.length > 0) {

                                        return res.status(200).json({ message: 'Product already added to list' })
                                    } else {
                                        query = "INSERT INTO tb_profoma_temp(invoice_number,productid,brand,quantity,unitprice,totalcost,customertype)VALUES($1,$2,$3,$4,$5,$6,$7)"
                                        r.query(query, [data.invoiceNumber, data.productId, data.brandId, data.quantity, data.uniPrice, data.quantity * data.uniPrice, data.customerType], (error, results) => {
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
router.post('/submit_profoma_Invoice', cors({ origin: '*' }), async (req, res) => {

    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            try {
                query = "SELECT * FROM tb_profoma_invoices  WHERE invoice_number=$1  "
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
                            query = "INSERT INTO tb_profoma_invoices(invoice_number, dateposted, customername, emailadress, addresss, customertype,telephone,cutomerid)VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
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




router.post('/profomainvoice', cors({ origin: '*' }), async (req, res) => {
    let data = req.body
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    await pool.connect().then(async (r) => {

        if (r._connected) {
            try {
                query = "SELECT invoice_number,productid,brand,quantity,unitprice,customertype,totalcost  FROM tb_profoma_temp WHERE invoice_number = $1"
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
                                query = 'INSERT INTO  tb_profoma_details(invoice_number,product_number,product_brand,quatity_sold,unit_price,total_price,dateposted)VALUES($1,$2,$3,$4,$5,$6,$7)'
                                r.query(query, [rws[counter].invoice_number, rws[counter].productid, rws[counter].brand, rws[counter].quantity, rws[counter].unitprice, rws[counter].totalcost, new Date()], (error, results) => {
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
                            query = 'DELETE FROM  WHERE invoice_number=$1'
                            r.query(query, [data.invoceNumber], (error, results) => {
                                if (error) {
                                    r.query('ROLLBACK')
                                    console.log(error)
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.query('COMMIT')
                                        r.release()
                                        return res.status(200).json({ success: 'Invoice submitted' })
                                    } else {
                                        r.query('ROLLBACK')
                                        r.release()
                                        return res.status(200).json({ message: 'Invoice could not be completed' })
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