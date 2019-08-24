var express = require('express')
var router = express.Router()
const {cartController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getcart',auth, cartController.getUserCart)
router.post('/addcart',auth, cartController.addToCart)
router.post('/updatecart',auth, cartController.updateItemCart)
router.get('/deletecart/:id/:userid',auth, cartController.deleteItemCart)

module.exports = router