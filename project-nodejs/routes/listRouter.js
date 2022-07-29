//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()

router.route('/')// get-(done) -post(done)

    //get all items with item name or category or city
   .get(itemController.getAllItems)   ///////////     get itemImage using association

   //Get filterd Items - category or city or name (search bar)
   .post(itemController.postSearchItems)

router.route('/item')//get-(done)
    //show item & details
    .get(itemController.getItemInformation)  //////////    get itemImage using association


module.exports = router