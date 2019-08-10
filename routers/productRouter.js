var express = require('express')
var router = express.Router()
const {productController} = require('../controllers')

router.get('/getprtable', productController.getAllFromProduct)
router.get('/getproduct',productController.getProductDetails)

module.exports = router;