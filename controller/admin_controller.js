const User = require('../models/user_model')
const path = require('path')
// const stripe = require('stripe')('sk_test_51MgLCXSDr4JMwduY2oavfpijCS8x40d4EXfh2tZxef7iVBIYvbWI681IbJ7mtP1eezbFYQxmrOVrgnb79prRMxmn009gbLMman')
const nodemailer = require('nodemailer')
const Product = require('../models/product_model')

// transporter for the mail
const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

        user: 'sdpatel320@gmail.com',
        pass: 'xkqmdiatqzbrzuue'
    }
})

// get product management
exports.getproductManagement = async (req, res, next) => {
    try {
        const product = await Product.find()

        res.render('productManagement/displayProduct', {
            pagetitle: 'Product Management',
            role: role,
            product
        })

    } catch (error) {
        console.log("errpr : ", error);
    }
}
// post add Product
exports.postAddProduct = async (req, res, next) => {

    const { product_name, price, product_category, product_type, quantity, product_description } = req.body
    const image = req.file

    const product = new Product({
        product_name,
        price,
        product_category,
        product_type,
        product_image: image.path,
        quantity,
        product_description
    })

    await product.save();
    res.redirect('/displayProduct')


}

// post edit Product
exports.postEditProduct = async (req, res, next) => {
    const productId = req.body.productId
    const { product_name, price, product_category, product_type, quantity, product_description } = req.body
    Product.findByIdAndUpdate(productId, {
        product_name : product_name,
        price : price,
        product_category : product_category,
        product_type :product_type ,
        quantity : quantity,
        product_description : product_description
    }).then(() =>{
    res.redirect('/displayProduct')
})

}

// post delete Product
exports.deleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    Product.findByIdAndDelete(productId).then(() =>{
    res.redirect('/displayProduct')
})

}




// // get Payment
// exports.makePayment = (req, res, next) => {

//     res.render('checkOut', {
//         pagetitle: 'checkOut'
//     })

// }


