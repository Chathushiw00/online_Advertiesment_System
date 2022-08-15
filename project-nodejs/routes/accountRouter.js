//imports

const itemController = require('../controllers/itemController')
const sellerController = require('../controllers/sellerController')
const itemImageMiddleware = require('../middleware/itemImageUpload')
const router = require('express').Router()

router.route('/')
//get all listings of the seller
.get(itemController.getAllItemsBySeller)    //get itemImage using association


router.route('/add')

//add listing--get categories,itemconditions,cities,sellerContact,sellerCity
.get(itemController.getAddItemNecessary)

//save listing
.post(itemImageMiddleware.upload,itemController.AddItem) // add itemImages



router.route('/edit')
//edit listing-- get itemCity
.get(itemController.getItemDetails) // get itemImage using association

//save edit listing
.post(itemImageMiddleware.upload,itemController.EditItem) //edit itemImages


router.route('/edit/delimgs')
//edit/delete item imges
    .get(itemController.delImgs)



router.route('/delete')

//delete or unpublish listing   delete?itemId=(give itemId)
.get(itemController.UnpublishItem)



router.route('/settings')

//get seller details
.get(sellerController.getSellerDetails)


//change & update seller settings
.post(sellerController.UpdateSellerDetails)


module.exports = router