const productModel = require("#models/product.model");

const getProduct = async (productId, fields) => {
  const productDetail = await productModel.findOne({ sku: productId }).select(fields);
  return productDetail;
};

module.exports = {
  getProduct,
};