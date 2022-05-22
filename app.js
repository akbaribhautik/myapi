const express = require('express')
const app = express()
const mongoose = require('mongoose')
const productdata = require('./api/route/product')
const userData = require('./api/route/user')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb+srv://admin:admin@cluster0.rvftp.mongodb.net/?retryWrites=true&w=majority')
mongoose.connection.on('error',err=>{
   console.log('connection fail')
})
mongoose.connection.on('connected',connected=>{
    console.log('connection connected')
 })

 app.use(fileUpload({
   useTempFiles : true,
   tempFileDir : '/tmp/'
}));
 app.use(bodyParser.urlencoded({extended:false}))
 app.use(bodyParser.json())
app.use('/product',productdata)
app.use('/user',userData)


module.exports = app;