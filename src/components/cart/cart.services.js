const { isEmpty } = require("../../library/helpers/validationHelpers");

const CartError = require("./cart.error");

const Cart = require("./cart.model");

exports.CartExists = async (name) => {
  const cart = await Cart.findOne(name);
  return cart;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "user product",
  pathQuery = "-password",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const cart = await Cart.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return cart[0];
  }
  return cart;
};

const saveCartWithPayload = async (payload = {}) => {
  const cart = new Cart(payload);
  await cart.save();

  return cart;
};
exports.createCart = async (payload) => {
  const cart = await saveCartWithPayload(payload);

  const savedCart = await findAndPopulate({ _id: cart._id }, null);

  return savedCart;
};

const findCart = async (query = {}, findMode = "one") => {
  const cart = await Cart.find(query);
  if (findMode === "one") {
    return cart[0];
  }
  return cart;
};

exports.findCartById = async (id) => {
  const cart = await Cart.findById({ _id: id });
  return cart;
};

exports.checkCartusership = async (userId) => {
  const cart = await findCart({ userId });

  if (isEmpty(cart)) {
    return false;
  }

  return true;
};

exports.fetchAllCarts = async () => {
  const cart = await Cart.find().populate("user product", "-password");
  return cart;
};

exports.fetchCartsByAdmin = async () => {
  const allCarts = await Cart.find({
    active: true,
  }).populate("user product", "-password");
  return allCarts;
};
exports.fetchUserCart = async (_id) => {
  const cart = await Cart.find({
    user: _id,
    active: true,
  }).populate("user product", "-password");
  return cart;
};

exports.fetchSingleCart = async (id, userId) => {
  let singleCart = await Cart.findOne({
    _id: id,
    user: userId,
    active: true,
  }).populate("user product", "-password");
  return singleCart;
};

exports.editCart = async (id, userId, cartObj) => {
  const updatedCart = await Cart.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: cartObj },
    { new: true }
  ).populate("user product", "-password");
  return updatedCart;
};

exports.deleteOneCart = async (id, userId) => {
  let deletedCart = await Cart.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { active: false } },
    { new: true }
  );
  return deletedCart;
};
