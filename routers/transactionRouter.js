var express = require('express')
var router = express.Router()
const {transactionController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.get('/getunconfirmed/:id', auth, transactionController.getProductWaiting)

module.exports = router