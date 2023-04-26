const path = require('path')
const User = require('../models/user_model')
const Product = require('../models/product_model')



exports.dashbord = (async (req, res, next) => {
  const Tproduct = await Product.find({ product_type: "t-shirt", product_category : "male" }).limit(12)
  const Sproduct = await Product.find({ product_type: "shirt" }).limit(6)
 
  const WWproduct = await Product.find({ product_type: "Western Wear" }).limit(6)
  const WSproduct = await Product.find({ product_type: "Saree" }).limit(6)



  res.render('home', {
    pagetitle: 'Home',
    path: '/home',
    role: role,
    Tproduct,
    Sproduct,
    WWproduct,
    WSproduct
  })
  next();
})

exports.getproductDetails = (async (req, res, next) =>{
  const id = req.query.id
  const product = await Product.findById(id)
  console.log(product);
  res.render('product/productDetail', {
    pagetitle : 'Product Details',
    role : role,
    product


  })
})

exports.getCart = (req, res, next) => {
  let totalPrice = 0;

  user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items;
      for (let i = 0; i < products.length; i++) {
        totalPrice = totalPrice + products[i].price;
      }
      //Set Cookie totalPrice = totalPrice  
      res.cookie('totalPrice', totalPrice, { httpOnly: true })
      res.render('product/cart',
        {
          totalPrice: totalPrice,
          products,
          pagetitle: 'Cart',
         
          
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      return user.addToCart(product);
    })
    .then(result => {

      if(role == 1){
        res.redirect('/displayProduct')
      }else(
        res.redirect('/')
      )
    })
    .catch(err => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  // console.log("🚀 ~ file: user_Controller.js:86 ~ exports.postDeleteCartItem ~ productId:", productId)
  user
    .removeFromCart(productId)
    .then(result => {
      
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}


exports.viewMore = async (req, res, next) => {
  
  const type = req.body.type;
  const product_category = req.body.product_category

  try {
    const product = await Product.find({ product_type: type, product_category: product_category })
    console.log(type);
    res.render('product/categoriesDisplay', {
      pagetitle:"dstyrfy",
      role: role,
      product
    })

  } catch (error) {
    console.log("error : ", error);
  }
}