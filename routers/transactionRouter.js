var express = require('express')
var router = express.Router()
const {transactionController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getunconfirmed/:id', auth, transactionController.getProductWaiting)
router.get('/getconfirmed/:id', auth, transactionController.getConfirmedProduct)
router.get('/getunconfirmedshop/:id', auth, transactionController.getConfirmProduct)
router.get('/confirmproduct/:id', auth, transactionController.confirmProduct)
router.post('/successproduct/:id', auth, transactionController.successProduct)
router.get('/getnotiflen/:id', transactionController.getNotificationLength)
router.get('/usertransaction/:id',auth, transactionController.getUserTransactionHistory)
router.get('/detailtransaction/:id/:tid',auth, transactionController.getTransactionDetail)
router.get('/shophistory/:id',auth, transactionController.getHistoryShop)
router.get('/deletetransaction/:id',auth, transactionController.deleteUserTransaction)
router.get('/cancelproduct/:id',auth, transactionController.cancelProduct)
router.get('/tidelete/:id',auth, transactionController.transactionItemDelete)
router.get('/getproductsold/:id',auth, transactionController.getProductSold)
module.exports = router