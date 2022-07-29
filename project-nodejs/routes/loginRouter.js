const router = require('express').Router()
const sellerController = require('../controllers/sellerController')

//get login page and authorization
router.route('/')//get-(done)  -post-(done)
    .get((req,res) =>{
        res.send('This is Login Page')
    })
    .post(sellerController.SellerLogin)

    module.exports = router