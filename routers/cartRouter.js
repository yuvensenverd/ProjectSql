var express = require('express')
var router = express.Router()
const {cartController} = require('../controllers')

router.get('/getcart', cartController.getUserCart)
router.post('/addcart',cartController.addToCart)

module.exports = router