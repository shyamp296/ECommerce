const express = require('express')
const { check } = require('express-validator')

const router = express.Router()

const authController = require('../controller/auth_controller')

const auth = require('../middleware/auth')
const User = require('../models/user_model')


router.get('/sign-In', authController.getlogin)
router.post('/sign-In', authController.signIn)
router.get('/registration', authController.getregister)
router.post('/registration', authController.addUser)
router.get('/sign-Out', auth, authController.signOut)
router.get('/forget-password', authController.getforgetPassword)
router.post('/forget-password', authController.postforgetPasword)
router.get('/reset-password/:id', authController.getresetPassword)
router.post('/reset-password', authController.postresetPassword)
router.post('/otpverify', authController.postOtpVerification)





module.exports = router