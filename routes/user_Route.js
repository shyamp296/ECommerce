const path = require('path')


const express = require('express')

const router = express.Router()

// const userModel = require('../models/user_model')
const userController = require('../controller/user_Controller')

const auth = require('../middleware/auth')
const roler = require('../middleware/role')




router.get('/', roler ,userController.dashbord)
router.get('/productDetails',roler, userController.getproductDetails)
router.get('/cart', auth, userController.getCart);
router.post('/cart', auth, userController.postCart);
router.post('/deletecartProduct', auth, userController.postDeleteCartItem);
router.post('/viewMore', roler, userController.viewMore);
router.post("/billing", auth, userController.postBilling);
router.post('/payment', auth, userController.postPayment);
router.get("/order", auth, userController.postOrder);

router.get("/orders", auth, userController.getOrder);



module.exports = router