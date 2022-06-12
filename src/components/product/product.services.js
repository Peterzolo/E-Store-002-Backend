const { isEmpty } = require("../../library/helpers/validationHelpers");
const productError = require("./product.error");

const Product = require("./product.model");

exports.productExists = async (name) => {
  const product = await Product.findOne(name);
  return product;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "user category",
  pathQuery = "-password",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const product = await Product.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return product[0];
  }
  return product;
};

const saveProductWithPayload = async (payload = {}) => {
  const product = new Product(payload);
  await product.save();

  return product;
};
exports.createProduct = async (payload) => {
  const product = await saveProductWithPayload(payload);

  const savedProduct = await findAndPopulate({ _id: product._id }, null);

  return savedProduct;
};

const findProduct = async (query = {}, findMode = "one") => {
  const product = await Product.find(query);
  if (findMode === "one") {
    return product[0];
  }
  return product;
};

exports.findProductById = async (id) => {
  const product = await Product.findById({ _id: id });
  return product;
};

exports.checkProductusership = async (userId) => {
  const product = await findProduct({ userId });

  if (isEmpty(product)) {
    return false;
  }

  return true;
};

exports.fetchMyProduct = async (id) => {
  const myProduct = await Product.find({
    status: "active",
    _id: id,
  }).populate("user category", "-password");
  return myProduct;
};

exports.fetchProductsByAdmin = async () => {
  const allProducts = await Product.find({ status: "active" }).populate(
    "user category ",
    "-password"
  );
  return allProducts;
};

exports.fetchSingleProduct = async (id) => {
  let singleProduct = await Product.findOne({
    _id: id,
    status: "active",
  }).populate("user category", "-password");
  return singleProduct;
};

exports.editProduct = async (id, userId, productObj) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: productObj },
    { new: true }
  ).populate("user", "-password");
  return updatedProduct;
};

exports.deleteOneProduct = async (id, userId) => {
  let deletedProduct = await Product.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return deletedProduct;
};
