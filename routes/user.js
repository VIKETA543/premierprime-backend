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
                        console.log('Signing successful')
                        r.release()
                        return res.status(200).json({ success: 'Custommer successfuly added' })
                    } else {
                        r.release()
                        console.log('Signing failed')
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
            console.log('Password successfully set for user with uac_id:', data.uac);
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
        const checkQuery = 'SELECT * FROM users WHERE email_address = $1 OR prim_phone_number=$2';
        const checkResult = await client.query(checkQuery, [data.email, data.email]);

        if (checkResult.rows.length > 0) {
            //   console.log('email correct',checkResult.rows)
            const saveUac = checkResult.rows[0].uac_id

            console.log('uacid:=>', saveUac)
            const findPasswordquery = 'SELECT u_passward,auto_login FROM tb_auth WHERE uac_id=$1';
            const oldPassword = await client.query(findPasswordquery, [saveUac])
            const auto_login = oldPassword.rows[0].auto_login
            console.log(oldPassword.rows)

            if (oldPassword.rows.length > 0) {
                const foundPassword = oldPassword.rows[0].u_passward
                console.log('found password', foundPassword)
                console.log('Supplied password', data.password)
                const isMatch = await bcrypt.compare(data.password, foundPassword);
                // if (isMatch) {
                    console.log('Password Match')
                    query = 'SELECT hook_number FROM uacp WHERE uac_id=$1'
                    client.query(query, [saveUac], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(201).json({ message: error.detail })
                        } else {

                            if (results.rows.length > 0) {
                                const saved_hook = results.rows[0].hook_number
                                console.log('the hook', saved_hook)
                                query = 'SELECT approved, uac_id FROM tb_auth WHERE uac_id=$1';
                                client.query(query, [saveUac], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        return res.status(201).json({ message: error })
                                        console.log(error);
                                    } else {
                                        if (results.rows.length > 0) {
                                            const approval = results.rows[0].approved
                                            const id = results.rows[0].uac_id

                                            if (approval === true) {

                                                console.log('auto_login', auto_login)
                                                return res.status(201).json({ success: 'Login succesful', hook: saved_hook, uac_id: id, user: checkResult.rows[0], autoLogin: auto_login })


                                            } else {
                                                if (approval === false) {
                                                    return res.status(201).json({ denied: 'Unable to login. Access denied' })
                                                } else {
                                                    return res.status(201).json({ wait: 'Waiting for approval from admin!.' })
                                                }
                                            }
                                        } else {
                                            return res.status(201).json({ wait: 'Waiting for approval from admin!.' })
                                        }
                                    }
                                })


                            // } else {
                            //     console.log('Your role could not be verified. Verify if you are authorise to login')
                            //     return res.status(201).json({ message: 'Your role could not be verified. Verify if you are authorise to login' })
                            // }
                        }
                    })


                } else {
                    console.log("Password does not match")
                    return res.status(201).json({ message: '"Invalid password. Your password cannot be found in the database"' })
                    console.log("Invalid password. Your password cannot be found in the database");
                }


            } else {
                return res.status(201).json({ NO_PASSWORD: 'NO_PASSWORD_FOUND' })
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




router.get('/userredentials', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT  uac_id, fullname,passport_picture_url FROM users'
            r.query(query, (error, results) => {
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



router.get('/listusers', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = `SELECT  users.uac_id, 
            users.fullname,
            users.passport_picture_url,
            users.prim_phone_number,
            users.email_address,
            users.national_id,
            users.passport_picture_url,
            users.date_posted,
            users.gender,
            users.digital_address,
            users.surburb,
            users.id_card_type,
            users.sec_phone_number, 
            users.date_of_birth,
            users.age,
            tb_auth.auto_login ,
            tb_auth.auth,
            tb_auth.approved
             FROM users LEFT JOIN 
             tb_auth ON users.uac_id=tb_auth.uac_id`
            r.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        r.release()
                        console.log('Users', results.rows)
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







router.post('/setUserAutoLogin', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = `SELECT uac_id FROM tb_auth WHERE uac_id = $1`
            r.query(query, [data.user], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = `UPDATE tb_auth SET auto_login=$1 WHERE uac_id=$2`
                        r.query(query, [data.auto_login, data.user], (error, results) => {
                            if (error) {
                                r.release()
                                return res.status(200).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release()
                                    if(data.auto_login===true){
                                            return res.status(200).json({ success: 'Auto login successfully granted for the user' })
                                    }else{
                                          return res.status(200).json({ success: 'Auto login revocked for the user' })  
                                    }
                                
                                } else {
                                    r.release()
                                    return res.status(200).json({ message: 'Unknown error has occured' })
                                }
                            }
                        })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Invalid User' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})



router.post('/onAccess', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = `SELECT uac_id FROM tb_auth WHERE uac_id = $1`
            r.query(query, [data.user], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = `UPDATE tb_auth SET auth=$1 WHERE uac_id=$2`
                        r.query(query, [data.access, data.user], (error, results) => {
                            if (error) {
                                r.release()
                                return res.status(200).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release()
                                    if(data.access===true){
                                               return res.status(200).json({ success: 'Account Access successfuly granted' })
                                    }else{
                                               return res.status(200).json({ success: 'Account Access successfuly Revocked' })
                                    }
                             
                                } else {
                                    r.release()
                                    return res.status(200).json({ message: 'Unknown error has occured' })
                                }
                            }
                        })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Invalid User' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})


router.post('/onApproval', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = `SELECT uac_id FROM tb_auth WHERE uac_id = $1`
            r.query(query, [data.user], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = `UPDATE tb_auth SET auth=$1 WHERE uac_id=$2`
                        r.query(query, [data.approved, data.user], (error, results) => {
                            if (error) {
                                r.release()
                                return res.status(200).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release()
                                    if(data.access===true){
                                               return res.status(200).json({ success: 'Account  successfuly approved' })
                                    }else{
                                               return res.status(200).json({ success: 'Account approval successfuly Revocked' })
                                    }
                             
                                } else {
                                    r.release()
                                    return res.status(200).json({ message: 'Unknown error has occured' })
                                }
                            }
                        })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Invalid User' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})




router.post('/onDeleteUser', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = `SELECT uac_id FROM tb_auth WHERE uac_id = $1`
            r.query(query, [data.user], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        query = `DELETE FROM users  WHERE uac_id=$1`
                        r.query(query, [data.user], (error, results) => {
                            if (error) {
                                r.release()
                                return res.status(200).json({ message: error.detail })
                            } else {
                                if (results.rowCount > 0) {
                                    r.release()
                                    if(data.access===true){
                                               return res.status(200).json({ success: 'Account  successfuly approved' })
                                    }else{
                                               return res.status(200).json({ success: 'Account approval successfuly Revocked' })
                                    }
                             
                                } else {
                                    r.release()
                                    return res.status(200).json({ message: 'Unknown error has occured' })
                                }
                            }
                        })
                    } else {
                        r.release()
                        return res.status(200).json({ message: 'Invalid User' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})




router.post('/submitUac', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)

    await pool.connect().then(async (r) => {
        if (r._connected) {
            r.query('BEGIN')
            query = 'SELECT  uac_id,hook_number  FROM uacp WHERE  hook_number=$1'
            r.query(query, [data.hrid], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    if (results.rows.length > 0) {
                        console.log('Exist')
                        r.release()
                        return res.status(200).json({ message: 'User has already been assigned to a store' })
                    } else {
                        query = 'INSERT INTO uacp(hook_number, hooked_department, hooked_store, login_redirect, description, date_posted, uac_id,access)VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
                        r.query(query, [data.hrid, data.departement, data.storeMumber, data.login_redirect, data.description, data.postedDate, data.user, data.access], (error, results) => {
                            if (error) {
                                r.release()
                                console.log(error)
                                r.query('ROLLBACK')
                                return res.status(201).json({ message: 'Unknown error has occured' })
                            } else {
                                if (results.rowCount > 0) {
                                    console.log('INSERTION COMPLETE')
                                    query = 'UPDATE  tb_auth SET   approved=$1, auth=$2  WHERE uac_id=$3';
                                    r.query(query, [true, true, data.user], (error, results) => {
                                        if (error) {
                                            console.log(error);
                                            r.query('ROLLBACK')
                                            return res.status(201).json({ message: error.detail })

                                        } else {
                                            if (results.rowCount > 0) {
                                                r.query('COMMIT')
                                                return res.status(201).json({ success: 'Role successfully created. Authorisation success. Account may not be having password.' })
                                            } else {
                                                return res.status(201).json({ message: 'Role failed created. Authorisation faled' })
                                            }

                                        }
                                    })
                                } else {
                                    r.query('ROLLBACK')
                                    r.release()
                                    return res.status(201).json({ message: 'Unknown error has occured' })
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






router.post('/authrole', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('The data: ', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT hook_number,hooked_department,hooked_store,uac_id,login_redirect,access FROM uacp WHERE hook_number=$1 AND access=$2 '
            r.query(query, [data.hrid, true], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {
                    console.log(results.rows)
                    if (results.rows.length > 0) {
                        const auth = results.rows[0].access
                        if (auth === true) {
                            console.log('authorisation suucess ON STORE', results.rows)
                            query = 'SELECT storenumber, storename FROM stores WHERE storenumber=$1'
                            r.query(query, [results.rows[0].hooked_store], (error, storeResults) => {
                                if (error) {
                                    console.log(error)
                                    r.release()
                                    res.status(201).json({ message: error.detail })
                                } else {
                                    return res.status(200).json({ success: 'Authorisation successful', data: results.rows, storeData: storeResults.rows })
                                }
                            })
                        } else {
                            if (auth === false) {
                                console.log('auth failed')
                                return res.status(200).json({ denied: 'Access denied. Your access has been revoked' })
                            } else {
                                console.log('waiting')
                                return res.status(200).json({ wait: 'Your account is waiting to be approved' })
                            }
                        }
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


// 

router.post('/loadUserInformation', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log('data=>: ', data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT users.uac_id,users.fullname,users.prim_phone_number,users.email_address,users.national_id,users.photo_id_url, users.passport_picture_url, users.date_posted, users.gender, users.digital_address, users.surburb, users.id_card_type, users.sec_phone_number, users.date_of_birth, users.age,' +
                ' stores.storenumber,stores.storename FROM users LEFT JOIN uacp ON users.uac_id=uacp.uac_id LEFT JOIN stores ON  uacp.hooked_store=stores.storenumber WHERE users.uac_id=$1'
            r.query(query, [data.uacp], (error, results) => {
                if (error) {
                    console.log(error)
                    r.release()
                    res.status(201).json({ message: error.detail })
                } else {

                    if (results.rows.length > 0) {
                        console.log(results.rows)
                        r.release()
                        return res.status(200).json({ success: 'Authorisation successful', data: results.rows })

                    } else {
                        r.release()
                        console.log('User not found')
                        return res.status(201).json({ message: 'Unknown user account' })
                    }
                }
            })
        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})



// resetPassword


router.post('/resetPassword', cors({ origin: '*' }), async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    let data = req.body
    console.log(data)
    await pool.connect().then(async (r) => {
        if (r._connected) {
            query = 'SELECT uac_id, fullname, prim_phone_number, email_address, national_id, date_posted, gender, digital_address, surburb, id_card_type, sec_phone_number,date_of_birth,age FROM users WHERE email_address = $1'
            r.query(query, [data.emailAddress], (error, results) => {
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
                        console.log('Signing failed')
                        return res.status(200).json({ message: 'Invalid email Address' })
                    }
                }
            })


        } else {
            r.release()
            return res.status(201).json({ message: 'Failed to connect to the database' })
        }
    })
})



module.exports = router


// 
