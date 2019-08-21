var express = require('express')
var router = express.Router()
const {cartController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getcart',auth, cartController.getUserCart)
router.post('/addcart',cartController.addToCart)
router.post('/updatecart', cartController.updateItemCart)
router.get('/deletecart/:id/:userid', cartController.deleteItemCart)

module.exports = router