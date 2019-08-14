var express = require('express')
var router = express.Router()
const { shopController } = require('../controllers')

router.post('/createshop', shopController.createStore)
router.get('/getshopinfo/:id', shopController.getUserStore)
router.get('/getproductshop/:id', shopController.getProductStore)

module.exports = router;