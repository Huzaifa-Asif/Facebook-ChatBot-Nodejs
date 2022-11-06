const mongoose = require("mongoose");

// Defining Product Schema
const productSchema = new mongoose.Schema({
  sku: { type: Number, required: true, unique: true, index: true },
  name: { type: String },
  type: { type: String },
  price: { type: Number },
  upc: { type: String },
  category: [{
    id: { type: String },
    name: { type: String },
  }],
  shipping: { type: Number },
  description: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  url: { type: String },
  image: { type: String },
});

const Product = mongoose.model("Product", productSchema);
Product.createIndexes();
module.exports = Product;