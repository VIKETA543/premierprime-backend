const express = require("express");
const pool = require('../dbconnectivity')
const cors = require('cors');
require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const { put } = require('@vercel/blob');
const config = { api: { bodyParser: false } };
const bcrypt = require('bcrypt');




router.post('/signup', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'INSERT INTO users (uac_id, fullname, prim_phone_number, email_address, national_id, date_posted, gender, digital_address, surburb, id_card_type, sec_phone_number,date_of_birth,age)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'
            r.query(query, [data.encrypted_Key, data.fullName, data.primPhone, data.emailAddress, data.idNumber, data.datePosted, data.gender, data.digitalAddress, data.surburb, data.idType, data.secPhone, data.dob, data.age], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
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




storage = multer({ storage: multer.memoryStorage() });

router.post('/uplaodIdCard', storage.single('IDCARD'), cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    console.log('Request body: ', req.file)
    let data = req.body


    if (!req.file) {
        return res.status(200).send('No file uploaded.');
    } else {

        const blob_id = await put(`uploads/useridcard/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN
        }
        );
        console.log('url: ', blob_id.url)

        await pool.connect().then(async (r) => {
            if (r._connected) {
                query = 'UPDATE users SET  photo_id_url=$1 WHERE uac_id=$2'
                r.query(query, [blob_id.url, data.key], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error.detail })
                    } else {
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
    console.log('data: ', data)
    console.log('File: ', req.file)

    if (!req.file) {
        return res.status(200).send('No file uploaded.');
    } else {

        const blob_id = await put(`uploads/userpassport/${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN
        }
        );
        console.log('url: ', blob_id.url)
        await pool.connect().then(async (r) => {
            if (r._connected) {
                query = 'UPDATE users SET  passport_picture_url=$1 WHERE uac_id=$2'
                r.query(query, [blob_id.url, data.key], (error, results) => {
                    if (error) {
                        console.log(error)
                        r.release()
                        return res.status(201).json({ message: error.detail })
                    } else {

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



// 


router.post('/setpassword', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  uac_id, fullname,passport_picture_url FROM users WHERE uac_id=$1'
            r.query(query, [data.uac], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        return res.status(200).json({ data: results.rows })
                    } else {
                        r.release()
                        return res.status(201).json({ message: 'Unknown error has occured' })
                    }
                }
            })
        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})





router.post('/submitpassword', cors({ origin: '*' }), async (req, res) => {
    const data = req.body;
    let client;

    try {
        // 1. Get a database client
        client = await pool.connect();

        // 2. Check if the password/user already exists
        const checkQuery = 'SELECT * FROM tb_auth WHERE uac_id = $1';
        const checkResult = await client.query(checkQuery, [data.uac]);

        if (checkResult.rows.length > 0) {
            return res.status(201).json({ message: 'The password you supplied already exists' });
        }

        // 3. Hash the password correctly (using await)
        const saltRounds = 10; // 10 is fast and secure
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // 4. Insert the new record
        const insertQuery = 'INSERT INTO tb_auth (uac_id, u_passward, auth, date_posted) VALUES($1, $2, $3, $4)';
        const insertResult = await client.query(insertQuery, [
            data.uac,
            hashedPassword,
            data.auth,
            data.date
        ]);

        if (insertResult.rowCount > 0) {
            return res.status(200).json({
                success: 'Password successfully set! Wait for account approval from admin'
            });
        } else {
            throw new Error('No rows were inserted');
        }

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            message: error.detail || 'An internal server error occurred'
        });
    } finally {
        // 5. CRITICAL: Always release the client back to the pool
        if (client) client.release();
    }
});





router.post('/signin', cors({ origin: '*' }), async (req, res) => {
    const data = req.body;
    let client;
    console.log(data)
    try {
        // 1. Get a database client
        client = await pool.connect();

        // 2. Check if the password/user already exists
        const checkQuery = 'SELECT uac_id FROM users WHERE email_address = $1 OR prim_phone_number=$2';
        const checkResult = await client.query(checkQuery, [data.email, data.email]);
        console.log('email correct')
        if (checkResult.rows.length > 0) {
            const saveUac = checkResult.rows[0].uac_id
            console.log('uac', saveUac)
            const findPasswordquery = 'SELECT u_passward FROM tb_auth WHERE uac_id=$1';
            const oldPassword = await client.query(findPasswordquery, [saveUac])

            if (oldPassword.rows.length > 0) {
                const foundPassword = oldPassword.rows[0].u_passward
                console.log('found password', foundPassword)

                const isMatch = await bcrypt.compare(data.password, foundPassword);
                if (isMatch) {
                    console.log('password match', true)
                    query = 'SELECT approved FROM tb_auth WHERE uac_id=$1';
                    await client.query(query, [saveUac], (error, results) => {
                        if (error) {
                            return res.status(201).json({ message: '"Invalid password. Your password cannot be found in the database"' })
                            console.log("Invalid password. Your password cannot be found in the database");
                        } else {
          
                            if (results.rows.length > 0) {
                                const approval = results.rows[0].approved
                                console.log(approval)
                                if (approval === true) {
                                    return res.status(201).json({ success: 'Login succesful' })
                                } else {
                                    if(approval===false){
                                    return res.status(201).json({ denied: 'Unable to login. Access denied' })
                                    }else{
                                        return res.status(201).json({ wait: 'Waiting for approval from admin!.' }) 
                                    }
                                }
                            } else {
                                return res.status(201).json({ wait: 'Waiting for approval from admin!.' })
                            }
                        }
                    })


                } else {
                    return res.status(201).json({ message: '"Invalid password. Your password cannot be found in the database"' })
                    console.log("Invalid password. Your password cannot be found in the database");
                }


            } else {
                return res.status(201).json({ message: 'Invalid password supplied' })
            }

        } else {
            return res.status(201).json({ message: 'Invalid Email or phone number supplied' })
        }

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            message: error.detail || 'An internal server error occurred'
        });
    } finally {
        // 5. CRITICAL: Always release the client back to the pool
        if (client) client.release();
    }
});

module.exports = router


// 