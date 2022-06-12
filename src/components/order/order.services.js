const { isEmpty } = require("../../library/helpers/validationHelpers");
const OrderError = require("./order.error");

const Order = require("./order.model");

exports.OrderExists = async (name) => {
  const order = await Order.findOne(name);
  return order;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "user product",
  pathQuery = "-password",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const order = await Order.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return order[0];
  }
  return order;
};

const saveOrderWithPayload = async (payload = {}) => {
  const order = new Order(payload);
  await order.save();

  return order;
};
exports.createOrder = async (payload) => {
  const order = await saveOrderWithPayload(payload);

  const savedOrder = await findAndPopulate({ _id: order._id }, null);

  return savedOrder;
};

const findOrder = async (query = {}, findMode = "one") => {
  const order = await Order.find(query);
  if (findMode === "one") {
    return order[0];
  }
  return order;
};

exports.findOrderById = async (id) => {
  const order = await Order.findById({ _id: id });
  return order;
};

exports.checkOrderusership = async (userId) => {
  const order = await findOrder({ userId });

  if (isEmpty(order)) {
    return false;
  }

  return true;
};

exports.fetchAllOrders = async () => {
  const orders = await Order.find().populate("user product", "-password");
  return orders;
};

exports.fetchOrdersByAdmin = async () => {
  const allOrders = await Order.find({
    active: true,
  }).populate("user product", "-password");
  return allOrders;
};
exports.fetchUserOrder = async (id) => {
  const orders = await Order.find({
    user: id,
    active: true,
  }).populate("user product", "-password");
  return orders;
};

exports.fetchSingleOrder = async (id) => {
  let singleOrder = await Order.findOne({
    _id: id,
    status: "active",
  }).populate("user product", "-password");
  return singleOrder;
};

exports.editOrder = async (id, userId, OrderObj) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: OrderObj },
    { new: true }
  ).populate("user product", "-password");
  return updatedOrder;
};

exports.deleteOneOrder = async (id, userId) => {
  let deletedOrder = await Order.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "false" } },
    { new: true }
  );
  return deletedOrder;
};
