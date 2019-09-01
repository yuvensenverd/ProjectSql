var express = require('express')
var router = express.Router()
const {userController} = require('../controllers')
const {auth} = require('../helpers/auth')

router.post('/getuser', userController.getUserData)
router.post('/addUser', userController.registerUser)
router.post('/saveprofile', userController.saveProfile)
router.get('/adminuser', userController.adminGetUser)
router.put('/emailverification', userController.emailVerification)
router.post('/resendemail', userController.resendEmailVer)
router.post('/logintoken',auth, userController.loginToken)
router.put('/changeresidence', auth, userController.changeResidence)
router.put('/onusertopup', auth, userController.onUserTopUp)
router.put('/onchangepass', auth, userController.onChangePassword)
// router.post('/getprofile', userController.getProfileUser)

module.exports = router