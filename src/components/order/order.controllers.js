const { validationResult } = require("express-validator");
const orderService = require("./order.services");
const userService = require("../user/user.service");

const orderError = require("./order.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw orderError.InvalidInput(errors.mapped());
  }

  const orderData = req.body;
  const userId = req.userId;
  const bodyUser = req.body.user;

  if (userId !== bodyUser) {
    throw orderError.NotAllowed("Sorry you cannot create this order");
  }

  const savedOrder = await orderService.createOrder(orderData);

  return res.status(200).send(
    sendResponse({
      message: "Order created successfully",
      content: savedOrder,
      success: true,
    })
  );
};

exports.getAllOrdersByAdmin = async (req, res) => {
  const userId = req.userId;
  const findUser = await userService.findUserById(userId);
  console.log("FIND USER", findUser.isAdmin);

  if (findUser.isAdmin === false) {
    throw orderError.NotAllowed();
  }
  const orders = await orderService.fetchOrdersByAdmin();

  if (orders.length < 1) {
    throw orderError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "orders successfully loaded",
      content: { orderCount: orders.length, Allorder: orders },
      success: true,
    })
  );
};

exports.getSingleOrder = async (req, res) => {
  try {
    let orderId = req.params.id;
    const userId = req.userId;

    if (isEmpty(orderId)) {
      throw orderError.NotFound("Please specify a order to be fetched");
    }

    const findUser = await userService.findUserById(userId);
    console.log("FIND USER", findUser.isAdmin);

    const order = await orderService.findOrderById(orderId);

    console.log("ORDER", order);


    if (order.user._id === userId || findUser.isAdmin === true) {
      if (order.status === "inactive" || order.isAvailable === false) {
        throw orderError.NotFound();
      }

      return res.status(200).send(
        sendResponse({
          message: "order updated",
          content: order,
          success: true,
        })
      );
    } else {
      throw orderError.NotAllowed();
    }
  } catch (error) {
    res.status(500).send({ error, message: "Error finding order" });
  }
};

exports.updateOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw orderError.InvalidInput(errors.mapped());
  }

  let updateData = req.body;
  const { orderId } = req.params;
  let user = req.userId;
  let isAdmin = req.isAdmin;

  if (isEmpty(orderId)) {
    throw orderError.NotFound("Please specify a order to edit");
  }

  const findOrder = await orderService.findOrderById(orderId);

  const orderOwner = findOrder.user._id.toString();

  if (isAdmin === true || user === orderOwner) {
    const query = orderId;
    const userId = user;
    const update = updateData;

    let editedOrder = await orderService.editOrder(query, userId, update);
    if (!editedOrder) {
      throw orderError.NotFound();
    }

    return res.status(200).send(
      sendResponse({
        message: "order updated",
        content: editedOrder,
        success: true,
      })
    );
  } else {
    throw orderError.NotAllowed();
  }
};

exports.deleteOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw orderError.InvalidInput(errors.mapped());
  }

  let deleteData = req.body.status;
  const { orderId } = req.params;
  let user = req.userId;
  let isAdmin = req.isAdmin;

  if (isEmpty(orderId)) {
    throw orderError.NotFound("Please specify a order to edit");
  }
  const findOrder = await orderService.findOrderById(orderId);
  const orderOwner = findOrder.user._id.toString();
  if (isAdmin === true || user === orderOwner) {
    const query = orderId;
    const userId = user;
    const update = deleteData;
    let deletedOrder = await orderService.deleteOneOrder(query, userId, update);
    if (!deletedOrder) {
      throw orderError.NotFound();
    }
    return res.status(200).send(
      sendResponse({
        message: "order updated",
        content: deletedOrder,
        success: true,
      })
    );
  } else {
    throw orderError.NotAllowed();
  }
};
