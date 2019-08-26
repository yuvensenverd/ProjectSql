var express = require('express')
var router = express.Router()
const {transactionController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getunconfirmed/:id', auth, transactionController.getProductWaiting)
router.get('/getunconfirmedshop/:id', auth, transactionController.getConfirmProduct)
router.get('/confirmproduct/:id', auth, transactionController.confirmProduct)

module.exports = router