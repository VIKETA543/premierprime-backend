const express = require('express')
const cors = require('cors');
const connecion = require('./dbconnectivity')
const Display = require('./routes/display')
const Category = require('./routes/category')
const Prices = require('./routes/prices')
const Suppliers=require('./routes/supplier')
const Wearhouse=require('./routes/warehouse')
const Stores=require('./routes/stores')
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/display', Display)
app.use('/category', Category)
app.use('/prices', Prices)
app.use('/supplier', Suppliers)
app.use('/warehouse',Wearhouse)
app.use('/stores',Stores)


module.exports = app;