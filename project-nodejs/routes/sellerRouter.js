const sellerController = require('../controllers/sellerController')
const router = require('express').Router()

router.route('/')//get- (done)
    //get seller profile-view  by normal user
    .get(sellerController.getSellerInfo)   /////////// get itemImage using association

module.exports = router