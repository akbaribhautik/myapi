const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    price:Number,
    number:Number,
    address:String,
    title: String,
    description: String,
    imagePath: String
})


module.exports = mongoose.model('Product', productSchema)