const { validationResult } = require("express-validator");

const cartService = require("./cart.services");
const userService = require("../user/user.service");

const cartError = require("./cart.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createCart = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw cartError.InvalidInput(errors.mapped());
  }

  const cartData = req.body;
  const userId = req.userId;
  const bodyUser = req.body.user;
  const isAdmin = req.isAdmin;

  if (userId === bodyUser || isAdmin === true) {
    const savedCart = await cartService.createCart(cartData);
    return res.status(200).send(
      sendResponse({
        message: "cart created successfully",
        content: savedCart,
        success: true,
      })
    );
  } else {
    throw cartError.NotAllowed("Sorry you cannot create this cart");
  }
};

exports.getAllCartsByAdmin = async (req, res) => {

const userId = req.userId

const findUser = await userService.findUserById(userId)

  if (findUser.isAdmin !== true) {
    throw cartError.NotAllowed();
  }

  const carts = await cartService.fetchCartsByAdmin();

  if (carts.length < 1) {
    throw cartError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "carts successfully loaded",
      content: { cartCount: carts.length, AllCart: carts },
      success: true,
    })
  );
};

exports.getSingleCart = async (req, res) => {
  let id = req.params.id;
  let userId = req.userId;
  let isAdmin = req.isAdmin;

  if (isEmpty(id)) {
    throw cartError.NotFound("Please specify a cart to be fetched");
  }
  const cart = await cartService.fetchSingleCart(id, userId);
  console.log("CART", cart);

  if (cart.user._id.toString() === userId || isAdmin === true) {
    return res.status(200).send(
      sendResponse({
        message: "cart loaded",
        content: cart,
        success: true,
      })
    );
  } else {
    throw cartError.NotAllowed();
  }
};

exports.updateCart = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw cartError.InvalidInput(errors.mapped());
  }

  let updateData = req.body;
  const { cartId } = req.params;
  let user = req.userId;
  let isAdmin = req.isAdmin;

  if (isEmpty(cartId)) {
    throw cartError.NotFound("Please specify a cart to edit");
  }

  const findCart = await cartService.findCartById(cartId);

  const cartOwner = findCart.user._id.toString();

  if (isAdmin === true || user === cartOwner) {
    const query = cartId;
    const userId = user;
    const update = updateData;

    let editedCart = await cartService.editCart(query, userId, update);
    if (!editedCart) {
      throw cartError.NotFound();
    }

    return res.status(200).send(
      sendResponse({
        message: "cart updated",
        content: editedCart,
        success: true,
      })
    );
  } else {
    throw cartError.NotAllowed();
  }
};

exports.deleteCart = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw cartError.InvalidInput(errors.mapped());
  }

  let deleteData = req.body.status;
  const { cartId } = req.params;
  let user = req.userId;
  let isAdmin = req.isAdmin;

  if (isEmpty(cartId)) {
    throw cartError.NotFound("Please specify a cart to edit");
  }
  const findCart = await cartService.findCartById(cartId);
  const cartOwner = findCart.user._id.toString();
  if (isAdmin === true || user === cartOwner) {
    const query = cartId;
    const userId = user;
    const update = deleteData;
    let deletedCart = await cartService.deleteOneCart(query, userId, update);
    if (!deletedCart) {
      throw cartError.NotFound();
    }
    return res.status(200).send(
      sendResponse({
        message: "cart removed",
        content: deletedCart,
        success: true,
      })
    );
  } else {
    throw cartError.NotAllowed();
  }
};

exports.getUserCart = async (req, res) => {
  const id = req.params.id;
  const user = req.userId;
  const isAdmin = req.isAdmin;
  if (user === id || isAdmin === true) {
    const carts = await cartService.fetchUserCart(id);
    return res.status(200).send(
      sendResponse({
        message: "cart loaded",
        content: carts,
        success: true,
      })
    );
  } else {
    throw cartError.NotAllowed();
  }
};
