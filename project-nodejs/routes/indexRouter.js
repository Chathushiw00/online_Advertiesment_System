//imports
const categoryController = require('../controllers/categoryController')

const router = require('express').Router()

//get Categories with item count

router.route('/') //get-(done)
    .get(categoryController.getAllCategoriesWithCount)


module.exports = router