var express = require('express')
var router = express.Router()
const {categoryController} = require('../controllers')

router.get('/getcategory', categoryController.getCategories)

module.exports = router