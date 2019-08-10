var express = require('express')
var router = express.Router()
const {userController} = require('../controllers')

router.post('/getuser', userController.getUserData)
router.post('/addUser', userController.registerUser)

module.exports = router