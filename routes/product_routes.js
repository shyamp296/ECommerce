const path = require('path')


const express = require('express')

const router = express.Router()

// const userModel = require('../models/user_model')
const productController = require('../controller/product_controller')

const auth = require('../middleware/auth')
const roler = require('../middleware/role')



//categories routes
router.get('/mensCategory',roler, productController.mensCategory)
router.get('/womensCategory', roler, productController.womensCategory)

// //Men's categories routes
// router.get('/MenTshirt', roler, productController.MenTshirt)
// router.get('/MenShirt', roler, productController.MenShirt)
// router.get('/MenJeans', roler, productController.MenJeans)
// router.get('/MenTrackpant', roler, productController.MenTrackpant)

// //Women's categories routes
// router.get('/MenTshirt', roler, productController.MenTshirt)
// router.get('/MenShirt', roler, productController.MenShirt)
// router.get('/womenJeans', roler, productController.MenJeans)
// router.get('/MenTrackpant', roler, productController.MenTrackpant)






module.exports = router