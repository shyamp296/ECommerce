const mongoose = require("mongoose");
var DateOnly = require("mongoose-dateonly")(mongoose);
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalprice: { type: String, required: true },
  orderedOn: { type: DateOnly, required: true },
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
