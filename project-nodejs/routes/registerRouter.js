
const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')

//get register page-registration
router.route('/')//get -(done)  -post-(done)

    //get cities to register page
    .get(cityController.getAllCities)

    //add new seller
    .post(sellerController.addNewSeller)

module.exports = router