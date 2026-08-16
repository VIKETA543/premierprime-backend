const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const { put } = require('@vercel/blob');
const config = { api: { bodyParser: false } };






router.post('/submitNewDepartment', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'INSERT INTO tb_department(hoid,departement_name,department_location,dept_description,hooked_store,date_created)VALUES($1,$2,$3,$4,$5,$6)'
            r.query(query, [data.hoid,data.deptName,data.location,data.deptDesc,data.hoockedstore,new Date()], (error, results) => {
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




router.post('/getDepartments', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  hoid,departement_name,department_location,dept_description,hooked_store,date_created FROM tb_department'
            r.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({data:results.rows, success: 'Departments loaded successfuly' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'No Departements available' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})



// isAlldepartments
router.post('/isAlldepartments', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT   hoid,departement_name,department_location,dept_description,hooked_store,date_created FROM tb_department WHERE departement_name = $1'
            r.query(query, [data.hoid], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({data:results.rows[0], success: 'Department data loaded successfuly' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'No Department data available' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})




router.post('/hook_all_stores', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT   storenumber,storename,storetype,storelacation,digitaladdress,storedescription,dateposted,isstoreopened FROM stores WHERE storename = $1'
            r.query(query, [data.hoid], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({data:results.rows[0], success: 'Stores data loaded successfuly' })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Not yet implemented' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})


module.exports=router