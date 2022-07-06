import Order from './order.model.js';

export const saveOrderPayload = async (args) => {
  const payload = await Order.create(args);
  return payload;
};

export const fetchAllOrders = async () => {
  const order = await Order.find({ status: 'active' }).populate(
    'user',
    '-password'
  );
  return order;
};

export const fetchUserOrderHistory = async (userId) => {
  const orders = await Order.find({ user: userId, status: 'active' }).populate(
    'user',
    '-password'
  );
  return orders;
};

export const findOrderById = async (id) => {
  const order = await Order.findById({ _id: id, status: 'active' });
  return order;
};

export const findOneOrder = async (id) => {
  const Order = await Order.findById({ _id: id }).populate(
    'user product',
    '-password'
  );
  return Order;
};

export const findOrderByName = async (query) => {
  const order = await Order.findOne(query);
  return order;
};

export const updateOrder = async (id, userId, orderObj) => {
  const order = await Order.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: orderObj },
    { new: true }
  );
  return order;
};

export const deleteOrder = async (id, userId) => {
  const order = await Order.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: 'inactive' } },
    { new: true }
  );
  return order;
};

export const findOrderOwnerById = async (id) => {
  const order = await Order.find({ status: 'active', user: id }).populate(
    'user product',
    '-password'
  );
  return order;
};
