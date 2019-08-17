var express = require('express')
var router = express.Router()
const {categoryController} = require('../controllers')

router.get('/getcategory', categoryController.getCategories)
router.post('/addcategory', categoryController.addCategory)
router.post('/editcategory/:id', categoryController.editCategory)

module.exports = router