var express = require('express')
var router = express.Router()
const { shopController } = require('../controllers')
const {auth} = require('../helpers/auth')

router.post('/createshop', shopController.createStore)
router.get('/getshopinfo/:id', shopController.getUserStore)
router.get('/getproductshop/:id', shopController.getProductStore)
router.get('/getshoprating', shopController.getShopRating)

module.exports = router;