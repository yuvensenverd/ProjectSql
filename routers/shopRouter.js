var express = require('express')
var router = express.Router()
const { shopController } = require('../controllers')

router.post('/createshop', shopController.createStore)

module.exports = router;