const router = require('express').Router()
const sellerController = require('../controllers/sellerController')

//get login page and authorization
router.route('/')
    
    //get login page
    .get((req,res) =>{
        res.send('This is Login Page')
    })

    //login authorizatiom
    .post(sellerController.SellerLogin)

    module.exports = router