var express = require('express')
var router = express.Router()
const {productController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getprtable',auth, productController.getAllFromProduct)
router.get('/getproduct',productController.getProductDetails)
router.post('/addproduct',auth, productController.addProduct)
router.post('/editimage',auth, productController.editimageProduct)
router.put('/editproduct/:id',auth, productController.editProduct)
router.get('/getreview/:id', productController.getReviews)
router.post('/addimage', auth, productController.addImage)
router.get('/deleteproduct/:id', auth, productController.deleteProduct)
module.exports = router;