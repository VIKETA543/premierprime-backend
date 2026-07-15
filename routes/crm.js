const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const { put } = require('@vercel/blob');
const config = { api: { bodyParser: false } };



router.post('/addCustomer', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'INSERT INTO customers(customer_number,dateposted,is_verified,customername,telephone,emailaddress,addresss,mobile_number,customertype,remarks)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
            r.query(query, [data.cutomerNumber, data.dateposted, true, data.customername, data.telephone, data.emailaddress, data.addresss, data.mobileNumber, data.customerType, data.remarks], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rowCount > 0) {
                        r.release()
                        return res.status(200).json({ success: 'Custommer successfuly added' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Unknown error has occured' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})







router.get('/loadcustomers', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  customer_number,dateposted,is_verified,customername,telephone,emailaddress,addresss,mobile_number,customertype,remarks FROM customers '
            r.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Unknown error has occured' })
                    }
                }
            })
        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})



router.post('/deleteCustomer', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'DELETE FROM customers WHERE customer_number = $1'
            r.query(query, [data.customer_number], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rowCount > 0) {
                        r.release()
                        return res.status(200).json({ success: 'Customer deleted successfully' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Unknown error has occured' })
                    }
                }
            })
        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})




router.post('/loadaccount', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  accountnumber,accountname,date,is_verified,telephone,emailaddress,address,mobile_number,remarks,isopened,identification_number,identification_type,passportpicture,id_image FROM deposit_account  WHERE  accountnumber=$1'
            r.query(query, [data.accountNumber], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        console.log('loading balances')
                        let customer = results.rows
                        query = 'SELECT balance FROM deposits WHERE accountnumber=$1 AND iscurrent=$2'
                        r.query(query, [data.accountNumber, true], (error, results) => {
                            if (error) {
                                r.release()
                                console.log(error)
                                res.status(201).json({ message: error })
                            } else {
                                if (results.rows.length > 0) {
                                    bal = results.rows
                                    r.release()
                                    return res.status(200).json({ data: customer, balance: bal })

                                } else {
                                    let d = [{
                                        balance: 0
                                    }]
                                    r.release()
                                    return res.status(200).json({ data: customer, balance: 0 })
                                }
                            }
                        })

                    } else {
                        r.release()
                        return res.status(200).json({ norecors: 'Unknown error has occured' })
                    }
                }
            })

        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})


// 



router.post('/postDesposit', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            r.query('BEGIN')
            query = ' SELECT accountNumber FROM deposits  WHERE  accountNumber=$1 AND iscurrent=$2'
            r.query(query, [data.accountNumber, true], (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {

                        query = 'UPDATE  deposits SET iscurrent=$1   WHERE accountNumber=$2 AND iscurrent=$3'
                        r.query(query, [false, data.accountNumber, true], (error, results) => {
                            if (error) {
                                r.release()
                                console.log(error)
                                res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = 'INSERT INTO deposits(accountNumber,transaction_number,transaction_date,credit,withdrawal,balance,iscurrent) VALUES($1,$2,$3,$4,$5,$6,$7)'
                                    r.query(query, [data.accountNumber, data.transactionNumber, data.date, data.amount, 0, data.sumBalance, data.isCurrent], (error, results) => {
                                        if (error) {

                                            console.log(error)

                                            r.query('ROLLBACK')
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                r.query('COMMIT')
                                                r.release()
                                                return res.status(200).json({ success: 'Deposit completed successfuly' })
                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(200).json({ success: 'Unable to complete transaction' })
                                            }
                                        }
                                    })
                                } else {

                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(200).json({ success: 'Unable to lock deposit records' })
                                }
                            }
                        })

                    } else {
                        query = 'INSERT INTO deposits(accountNumber,transaction_number,transaction_date,credit,withdrawal,balance,iscurrent) VALUES($1,$2,$3,$4,$5,$6,$7)'
                        r.query(query, [data.accountNumber, data.transactionNumber, data.date, data.amount, 0, data.sumBalance, data.isCurrent], (error, results) => {
                            if (error) {
                                console.log(error)

                                r.query('ROLLBACK')
                                r.release()
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    r.query('COMMIT')
                                    r.release()
                                    return res.status(200).json({ success: 'Deposit completed successfuly' })
                                } else {
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(200).json({ success: 'Unable to complete transaction' })
                                }
                            }
                        })
                    }
                }
            })

        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})




router.post('/postWithdrawal', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            r.query('BEGIN')
            query = ' SELECT accountnumber FROM deposits  WHERE  accountNumber=$1 AND iscurrent=$2'
            r.query(query, [data.accountNumber, true], (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {

                        query = 'UPDATE  deposits SET iscurrent=$1   WHERE accountnumber=$2 AND iscurrent=$3'
                        r.query(query, [false, data.accountNumber, true], (error, results) => {
                            if (error) {
                                r.release()
                                console.log(error)
                                res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    query = 'INSERT INTO deposits(accountnumber,transaction_number,transaction_date,credit,withdrawal,balance,iscurrent) VALUES($1,$2,$3,$4,$5,$6,$7)'
                                    r.query(query, [data.accountNumber, data.transactionNumber, data.date,0,  data.amount, data.sumBalance, data.isCurrent], (error, results) => {
                                        if (error) {

                                            console.log(error)

                                            r.query('ROLLBACK')
                                            r.release()
                                            return res.status(201).json({ message: error })
                                        } else {
                                            if (results.rowCount > 0) {
                                                r.query('COMMIT')
                                                r.release()
                                                return res.status(200).json({ success: 'Deposit completed successfuly' })
                                            } else {
                                                r.query('ROLLBACK')
                                                r.release()
                                                return res.status(200).json({ success: 'Unable to complete transaction' })
                                            }
                                        }
                                    })
                                } else {

                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(200).json({ success: 'Unable to lock deposit records' })
                                }
                            }
                        })

                    } else {
                        query = 'INSERT INTO deposits(accountnumber,transaction_number,transaction_date,credit,withdrawal,balance,iscurrent) VALUES($1,$2,$3,$4,$5,$6,$7)'
                        r.query(query, [data.accountnumber, data.transactionNumber, data.date,0,  data.amount, data.sumBalance, data.isCurrent], (error, results) => {
                            if (error) {
                                console.log(error)

                                r.query('ROLLBACK')
                                r.release()
                                return res.status(201).json({ message: error })
                            } else {
                                if (results.rowCount > 0) {
                                    r.query('COMMIT')
                                    r.release()
                                    return res.status(200).json({ success: 'Deposit completed successfuly' })
                                } else {
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(200).json({ success: 'Unable to complete transaction' })
                                }
                            }
                        })
                    }
                }
            })

        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})









router.post('/postAccount', cors({ origin: '*' }), async (req, res) => {

        res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
        await pool.connect().then(async (r) => {
            let data = req.body
            if (r._connected) {
                r.query('BEGIN')
                query = ' SELECT identification_number FROM deposit_account  WHERE  identification_number=$1 '
                r.query(query, [data.identificationNumber], (error, results) => {
                    if (error) {
                        r.release()
                        console.log(error)
                        res.status(201).json({ message: error })
                    } else {
                        if (results.rows.length > 0) {
                            r.release()
                            res.status(201).json({ message: 'An account with the same identification number already exists' })
                        } else {
                            query = 'INSERT INTO deposit_account(accountnumber,accountname,date,is_verified,telephone,emailaddress,address,mobile_number,remarks,isopened,identification_number,identification_type) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
                            r.query(query, [data.AccountNumber, data.AccountName, data.dateOpened, data.verirified, data.telephoneNumber,data.emailAddress, data.address, data.mobileNumber, data.remarks, data.isaccountOpened, data.identificationNumber, data.identificationType], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(201).json({ message: error })
                                } else {
                                    if (results.rowCount > 0) {
                                        r.query('COMMIT')
                                        r.release()
                                        console.log('Account created successfully')
                                        return res.status(200).json({ success: 'Deposit completed successfuly' })
                                    } else {
                                        r.query('ROLLBACK')
                                        r.release()
                                        return res.status(200).json({ success: 'Unable to complete transaction' })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
  
})


    storage = multer({ storage:  multer.memoryStorage()  });

router.post('/uplaodIdCard', storage.single('IDCARD'), cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Request body: ', req.file)
    let data = req.body
    
      
    if (!req.file) {
        return res.status(200).send('No file uploaded.');
    } else {
       
        const blob_id = await put(`uploads/customerid/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN
        }
        );
       console.log('url: ',blob_id.url)
       
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'UPDATE deposit_account SET  id_image=$1 WHERE accountnumber=$2'
            r.query(query, [ blob_id.url, data.AccountNumber], (error, results)=>{
                if (error) {
                    console.log(error)
                    r.release()
                    return res.status(201).json({ message: error })
                }else{
                    if (results.rowCount > 0) {
                        r.release()
                        r.query('COMMIT')
                        return res.status(200).json({ success: 'ID card uploaded successfully' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Unable to upload ID card' })
                    }
                }
            })
            
        }
    })
}
})



router.post('/uploadpassport', storage.single('PASSPORT'), cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Request body: ', req.file)
    let data = req.body
           console.log('data: ',data)
           console.log('File: ',req.file)
      
    if (!req.file) {
        return res.status(200).send('No file uploaded.');
    } else {
       
        const blob_id = await put(`uploads/customerpassport/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN
        }
        );
             console.log('url: ',blob_id.url)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'UPDATE deposit_account SET  passportpicture=$1 WHERE accountnumber=$2'
            r.query(query, [blob_id.url, data.AccountNumber], (error, results)=>{
                if (error) {
                    console.log(error)
                    r.release()
                    return res.status(201).json({ message: error })
                }else{
              
                    if (results.rowCount > 0) {
                        r.query('COMMIT')
                        r.release()
                        return res.status(200).json({ success: 'Passport uploaded successfully' })

                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Unable to upload Passport' })
                    }
                }
            })
            
        }
    })
}
})

router.post('/getDepositAccounts', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = ' SELECT accountnumber,accountname,date,is_verified,telephone,emailaddress,address,mobile_number,remarks,isopened,identification_number,identification_type,passportpicture,id_image FROM deposit_account '
            r.query(query, (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'No current deposits found for the specified customer' })
                    }
                }
            })

        }
    })
})





router.get('/loadDepositSummeries', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified header
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT deposits.accountNumber,deposits.transaction_number,deposits.transaction_date,deposits.credit,deposits.balance,deposits.iscurrent,deposit_account.accountname FROM deposits JOIN deposit_account ON deposits.accountnumber = deposit_account.accountnumber WHERE deposits.iscurrent=$1'
            r.query(query, [true], (error, results) => {
                if (error) {
                    r.release()
                    console.log(error)
                    res.status(201).json({ message: error })
                } else {
                  
                    if (results.rows.length > 0) {
                        //   console.log('Loading deposit summeries', results.rows)
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        console.log('No current deposits found for the specified customer')
                        r.release()
                        return res.status(200).json({ message: 'No current deposits found for the specified customer' })
                    }
                }
            })

        }
    })
})

module.exports = router;