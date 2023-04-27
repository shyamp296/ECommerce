const path = require("path");
const Stripe = require("stripe")(
  "sk_test_51MgLCXSDr4JMwduY2oavfpijCS8x40d4EXfh2tZxef7iVBIYvbWI681IbJ7mtP1eezbFYQxmrOVrgnb79prRMxmn009gbLMman"
);

const User = require("../models/user_model");
const Product = require("../models/product_model");
const Order = require("../models/order_modal");

exports.dashbord = async (req, res, next) => {
  const Tproduct = await Product.find({
    product_type: "t-shirt",
    product_category: "male",
  }).limit(12);
  const Sproduct = await Product.find({ product_type: "shirt" }).limit(6);

  const WWproduct = await Product.find({ product_type: "Western Wear" }).limit(
    6
  );
  const WSproduct = await Product.find({ product_type: "Saree" }).limit(6);

  res.render("home", {
    pagetitle: "Home",
    path: "/home",
    role: role,
    Tproduct,
    Sproduct,
    WWproduct,
    WSproduct,
  });
  next();
};

exports.getproductDetails = async (req, res, next) => {
  const id = req.query.id;
  const product = await Product.findById(id);
  console.log(product);
  res.render("product/productDetail", {
    pagetitle: "Product Details",
    role: role,
    product,
  });
};

exports.getCart = (req, res, next) => {
  let totalPrice = 0;

  user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      for (let i = 0; i < products.length; i++) {
        totalPrice = totalPrice + products[i].price;
      }
      //Set Cookie totalPrice = totalPrice
      res.cookie("totalPrice", totalPrice, { httpOnly: true });
      res.render("product/cart", {
        totalPrice: totalPrice,
        products,
        pagetitle: "Cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then((result) => {
      if (role == 1) {
        res.redirect("/displayProduct");
      } else res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  // console.log("🚀 ~ file: user_Controller.js:86 ~ exports.postDeleteCartItem ~ productId:", productId)
  user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postBilling = (req, res, next) => {
  user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    console.log(
      "🚀 ~ file: user_Controller.js:105 ~ products ~ products:",
      products
    );
    res.render("product/billing", {
      pagetitle: "Payment",
      products: products,
    });
  });
};

//post Payment
exports.postPayment = async (req, res, next) => {
  const { title, amount } = req.body;
  console.log(
    "🚀 ~ file: user_Controller.js:122 ~ exports.postPayment= ~ req.body:",
    req.body
  );

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          // The currency parameter determines which
          // payment methods are used in the Checkout Session.
          currency: "inr",
          product_data: {
            name: title,
          },
          unit_amount: amount * 100,
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:8000/order",
    cancel_url: "http://localhost:5000/cart",
  });

  res.redirect(303, session.url);
};

exports.postOrder = (req, res, next) => {
  user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      console.log(
        "🚀 ~ file: user_Controller.js:104 ~ products ~ products:",
        products
      );
      let total = 0;
      const totalPrice = products.map((t) => { 
        return  total = total + (t.quantity * t.product.price)
      })
      const order = new Order({
        user: {
          email: user.email,
          userId: user,
        },
        products: products,
        totalprice: total,
        orderedOn: Date.now("MM-DD-YYYY")
      });
      return order.save();
    })
    .then((result) => {
      return user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrder = (req, res, next) => {
  
  Order.find({ id}).then((orders) => {
    console.log("🚀 ~ file: shop.js:142 ~ orders:", orders.products);
    res.render("product/order", {
      pagetitle: "Your Orders",
      orders: orders,
    });
  });
};

exports.viewMore = async (req, res, next) => {
  const type = req.body.type;
  const product_category = req.body.product_category;

  try {
    const product = await Product.find({
      product_type: type,
      product_category: product_category,
    });
    console.log(type);
    res.render("product/categoriesDisplay", {
      pagetitle: "dstyrfy",
      role: role,
      product,
    });
  } catch (error) {
    console.log("error : ", error);
  }
};
