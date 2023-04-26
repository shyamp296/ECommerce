const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    product_category: {
        type: String,
        required: true
    },
    product_type : {
        type: String,
        required: true
    },

  


}
)

module.exports = mongoose.model('Product', productSchema)