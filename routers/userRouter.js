var express = require('express')
var router = express.Router()
const {userController} = require('../controllers')

router.post('/getuser', userController.getUserData)
router.post('/addUser', userController.registerUser)
router.post('/saveprofile', userController.saveProfile)
router.get('/adminuser', userController.adminGetUser)
router.put('/emailverification', userController.emailVerification)
router.post('/resendemail', userController.resendEmailVer)
// router.post('/getprofile', userController.getProfileUser)

module.exports = router