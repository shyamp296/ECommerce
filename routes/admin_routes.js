const path = require('path')


const express = require('express')

const router = express.Router()


const userController = require('../controller/user_Controller')
const adminController = require('../controller/admin_controller')


const auth = require('../middleware/auth')

router.get('/displayProduct', auth, adminController.getproductManagement)
router.post('/add-product', auth, adminController.postAddProduct)
router.post('/edit-product', auth, adminController.postEditProduct)

router.post('/deleteProduct', auth, adminController.deleteProduct)


// router.post('/Payment', auth , adminController.postPayment)
// router.get('/Payment', auth, adminController.makePayment)


module.exports = router