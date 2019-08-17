var express = require('express')
var router = express.Router()
const {bannerController} = require('../controllers')

router.get('/getbanner', bannerController.getBannerImg)

module.exports = router