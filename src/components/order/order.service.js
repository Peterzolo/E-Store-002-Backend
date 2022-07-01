import {
  findOrderById,
  findOrderByName,
  saveOrderPayload,
} from './order.dao.js';
import ApiError from '../../error/ApiError.js';

export const createOrder = async ({
  user,
  orderItems,
  seller,
  shippingAddress,
  paymentMethod,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  status,
}) => {
  const orderObject = {
    user,
    orderItems,
    seller,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status,
  };

  // const OrderExists = await findOrderByName({ name });

  // if (OrderExists) {
  //   throw ApiError.OrderExists(
  //     'Order with this name has already been posted'
  //   );
  // }

  const order = await saveOrderPayload(orderObject);
  return {
    createdAt: new Date().toISOString(),
    user: order.user,
    orderItems: order.orderItems,
    seller: order.seller,
    shippingAddress: order.shippingAddress,   
    paymentMethod: order.paymentMethod,
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,  
    taxPrice: order.taxPrice,
    totalPrice: order.totalPrice,
    status: order.user,
    _id: order._id,
  };
};
