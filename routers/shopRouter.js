var express = require('express')
var router = express.Router()
const { shopController } = require('../controllers')
const {auth} = require('../helpers/auth')

router.post('/createshop', shopController.createStore)
router.get('/getshopinfo/:id', auth, shopController.getUserStore)
router.get('/getproductshop/:id',auth, shopController.getProductStore)

module.exports = router;