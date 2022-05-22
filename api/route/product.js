const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dakcf3dct',
    api_key: '234584553469613',
    api_secret: '1srGII8er39W61cjILZ6BFa3Qdo',

});
router.get('/', checkAuth, (req, res, next) => {
    Product.find()
        .then(result => {
            console.log(result)

            res.status(200).json({
                status: 200,
                message: 'success',
                data: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 400,
                message: 'fail',
                Error: err
            })
        })
})

//find data useing id
router.get('/:id', checkAuth, (req, res, next) => {
    Product.findById(req.params.id)
        .then(result => {
            console.log(result)

            res.status(200).json({
                status: 200,
                message: 'success',
                data: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 400,
                message: 'fail',
                Error: err
            })
        })
})
//delete data useing id

router.delete('/:id', checkAuth, (req, res, next) => {
    Product.remove({ _id: req.params.id })
        .then(result => {
            console.log('checkdata', result)

            res.status(200).json({
                status: 200,
                message: 'success',
                result: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 400,
                message: 'fail',
                Error: err
            })
        })
})


//updat data useing id

router.put('/:id', checkAuth, (req, res, next) => {
    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            imagePath: req.body.imagePath,
        }
    })
        .then(result => {
            console.log('checkdata', result)

            res.status(200).json({
                status: 200,
                message: 'success',
                updateProduct: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 400,
                message: 'fail',
                Error: err
            })
        })
})
router.post('/addProduct', (req, res, next) => {
    const file = req.files.photo;

    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        console.log(result)
        const product = new Product({
            _id: new mongoose.Types.ObjectId,
            title: req.body.title,
            description: req.body.description,
            imagePath: result.url,
        })
        product.save()
            .then(result => {
                console.log(result)

                res.status(200).json({
                    status: 200,
                    message: 'success',
                    data: [result]
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    status: 400,
                    message: 'fail',
                    Error: err
                })
            })
    })

})

module.exports = router;