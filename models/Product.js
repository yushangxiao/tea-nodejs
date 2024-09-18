const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true  
  },
  productPrice: {
    type: Number,
    required: true
  },
  isOnSale: {
    type: Boolean,
    default: true
  },
  createTime: {
    type: Date,
    default: Date.now  
  },
  imageName: {
    type: String,
    required: true
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;

