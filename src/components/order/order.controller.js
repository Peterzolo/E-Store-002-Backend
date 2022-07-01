import mongoose from 'mongoose';
import {
  deleteOrder,
  fetchAllOrders,
  findOrderById,
  findOrderOwnerById,
  updateOrder,
} from './order.dao.js';
import ApiError from '../../error/ApiError.js';
import { findUserById } from '../user/user.dao.js';
import Order from './order.model.js';
import { createOrder } from './order.service.js';

export const postOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status,
    } = req.body;

    const userId = req.userId;
    console.log('USER ID',userId)

    const dataObject = {
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status,
    };
    // const sender = req.userId;
    const orderData = await createOrder(dataObject);
    res.status(200).json({
      success: true,
      message: 'Order successfully created',
      data: orderData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await fetchAllOrders();
    if (!allOrders.length) {
      throw ApiError.notFound({ message: 'No data found' });
    }
    res.status(200).json({
      dataCount: allOrders.length,
      success: true,
      message: 'Successfully fetched all local Order',
      data: allOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////

// export const getAllOrders = async (req, res) => {
//   const { page } = req.query;
//   try {

//     const limit = 6;
//     const startIndex = (Number(page) - 1) * limit;
//     const total = await Order.countDocuments({});
//     const Orders = await Order.find().limit(limit).skip(startIndex);
//     res.json({
//       data: Orders,
//       currentPage: Number(page),
//       totalOrders: total,
//       numberOfPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(404).json({ message: 'Something went wrong' });
//   }
// };

///////////////////////////////////////////////////////////////////

export const getOneOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const findOrder = await findOrderById(id);
    if (findOrder) {
      const Order = findOrder;
      res.status(200).send({
        Success: true,
        message: 'Order successfully fetched',
        data: Order,
      });
    } else {
      res.status(401).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    res.status(400).send({ message: 'Error has occured' });
  }
};

export const editOrder = async (req, res) => {
  try {
    const { Order } = req.params;
    const userId = req.userId._id;
    const updateData = req.body;
    const findOrder = await findOrderById(Order);

    if (findOrder.status === 'inactive') {
      throw ApiError.notFound({ message: 'Order not found' });
    }

    const query = Order;
    const user = userId;
    const update = updateData;

    let editedOrder = await updateOrder(query, user, update);

    if (!editedOrder) {
      throw ApiError.notFound({ message: 'Order not available' });
    }
    return res.status(200).send({
      message: 'Order updated successfully',
      content: editedOrder,
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const findUser = await findUserById(userId);

    // if (findUser._id.toString() !== userId) {
    //   throw ApiError.forbidden({ message: "Not allowed" });
    // }

    const findOrder = await findOrderById(id);

    if (findOrder.status === 'inactive') {
      throw ApiError.notFound({ message: 'Order not found' });
    }

    const query = id;
    const user = userId;

    let deletedOrder = await deleteOrder(query, user);

    if (!deletedOrder) {
      throw ApiError.notFound({ message: 'Order not available' });
    }
    return res.status(200).send({
      message: 'Order deleted successfully',
      content: deletedOrder,
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const findOrderByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userOrder = await findOrderOwnerById(id);
    if (userOrder.length < 1) {
      throw ApiError.notFound({ message: 'Order could not be found' });
    }
    res.status(200).json({
      Success: true,
      Message: 'Order successfully fetched',
      data: userOrder,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const searchOrderByTitle = async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const title = new RegExp(searchQuery, "i");
//     const Orders = await fetchAllOrders({ title });
//     res.status(200).json(Orders);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

export const searchOrderByTitle = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, 'i');
    const Orders = await Order.find({ title });
    res.json(Orders);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getOrdersByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const Orders = await Order.find({ tags: { $in: tag } });
    res.json({
      success: true,
      message: 'Successful',
      data: Orders,
    });
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getRelatedOrders = async (req, res) => {
  const tag = req.body;
  try {
    const Orders = await Order.find({ tags: { $in: tag } });
    res.json({
      success: true,
      message: 'Successful',
      data: Orders,
    });
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getOrderLikes = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: 'User is not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No Order exist with id: ${id}` });
    }

    const Order = await Order.findById(id);

    const index = Order.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      Order.likes.push(req.userId);
    } else {
      Order.likes = Order.likes.filter((id) => id !== String(req.userId));
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, Order, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully liked',
      data: updatedOrder,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
