var express = require('express')
var router = express.Router()
const {bannerController} = require('../controllers')

router.get('/getbanner', bannerController.getBannerImg)
router.post('/addbanner', bannerController.addBannerImg)
router.get('/getpathbanner', bannerController.getBannerPath)
router.delete('/deletebanner/:id', bannerController.deleteBanner)

module.exports = router