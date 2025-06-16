const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantityAvailable: { type: Number, required: true },
  description: { type: String },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true }, // Reference by category name
  image: { type: String }, // filename or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
