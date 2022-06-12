const express = require('express')
const router = express.Router()
const User = require('../model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')

router.get('/getProfile',checkAuth, (req, res, next) => {
    User.find()
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
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
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

router.delete('/:id', (req, res, next) => {
    User.remove({ _id: req.params.id })
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

router.put('/:id', (req, res, next) => {
    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone,
            email: req.body.email,
           
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
router.post('/signup', (req, res, next) => {
    User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (user) {
          res.status(400).send({ message: "Email is already in use!" });
          return;
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    Error: err
                })
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId,
                    username: req.body.username,
                    password: hash,
                    phone: req.body.phone,
                    email: req.body.email,
                   
    
                })
                user.save()
                .then(result => {
                    console.log('res', res)
        
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
            }
        });     
      });
    });
  


router.post('/login', (req, res, next) => {
   User.find({email:req.body.email})
   .exec()
   .then(user=>{
       if(user.length <1){
           return res.status(401).json({
               message:'user not exist'
           })
       }
       bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
        if(!result){
            return res.status(401).json({
                message:'password matching fail'
            })
        } if(result){
          const token =  jwt.sign({
               username:user[0].username,
               email:user[0].email,
               phone:user[0].phone,
              }, 'this is dummy text',{ expiresIn: '24h' });
              res.status(200).json({
                _id: user[0]._id,
                username:user[0].username,
                email:user[0].email,
                phone:user[0].phone,
                token:token,
                

                
              })
        }
        
       })
   })
   .catch(err=>{
       res.status(500).json({
           err:err
       })
   })
})
module.exports = router;