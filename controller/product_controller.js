const path = require('path')
const User = require('../models/user_model')
const Product = require('../models/product_model')


exports.mensCategory = async(req , res , next ) => {

    res.render('product/menCategories', { 
        pagetitle: 'Men Category',
        role : role
    })
}

exports.womensCategory = async (req, res, next) => {

    res.render('product/womenCategories', {
        pagetitle: 'Women Category',
        role: role
    })
}




