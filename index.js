const express = require('express')
const cors = require('cors'); 
const connecion=require('./dbconnectivity')
const Display=require('./routes/display')
const Category=require('./routes/category')
const app = express();
const path = require('path');

 app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors()); 
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/display',Display)
 app.use('/category',Category)

//  app.use('/uploads', express.static('/category_images')); 
module.exports=app;