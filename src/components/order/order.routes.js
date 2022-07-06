import express from 'express';

const orderRouter = express.Router();

import {
  editOrder,
  getAllOrders,
  getOneOrder,
  getUserOrderHistory,
  postOrder,
  removeOrder,
  searchOrderByTitle,
  updateOrderPayment,
} from './order.controller.js';
// import { validate, validateorderData } from "./order.validation.js";
import { protect } from '../../middleware/auth2.js';
// import getAuthorized from "../../middleware/authMiddleware.js"

orderRouter.post('/create',protect, postOrder);
orderRouter.get('/fetch-all', getAllOrders);
orderRouter.get('/fetch-one/:id',protect, getOneOrder);
orderRouter.put('/update/:id',protect, updateOrderPayment);
orderRouter.get('/history',protect, getUserOrderHistory);
orderRouter.put('/edit/:order', protect, editOrder);
orderRouter.delete('/remove/:id', protect, removeOrder);
orderRouter.get('/search', searchOrderByTitle);

export default orderRouter;
