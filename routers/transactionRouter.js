var express = require('express')
var router = express.Router()
const {transactionController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getunconfirmed/:id', auth, transactionController.getProductWaiting)
router.get('/getconfirmed/:id', auth, transactionController.getConfirmedProduct)
router.get('/getunconfirmedshop/:id', auth, transactionController.getConfirmProduct)
router.get('/confirmproduct/:id', auth, transactionController.confirmProduct)
router.get('/successproduct/:id', auth, transactionController.successProduct)
router.get('/getnotiflen/:id', transactionController.getNotificationLength)

module.exports = router