var express = require('express')
var router = express.Router()
const {cartController} = require('../controllers')

router.get('/getcart', cartController.getUserCart)
router.post('/addcart',cartController.addToCart)
router.post('/updatecart', cartController.updateItemCart)

module.exports = router