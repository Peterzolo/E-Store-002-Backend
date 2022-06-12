const { validationResult } = require("express-validator");
const productService = require("./product.services");
const userService = require("../user/user.service");

const productError = require("./product.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw productError.InvalidInput(errors.mapped());
  }

  const productData = req.body;
  const userId = req.userId;
  const bodyuser = req.body.user;

  if (userId !== bodyuser) {
    throw productError.NotAllowed("Sorry you cannot create this product");
  }

  const savedProduct = await productService.createProduct(productData);

  return res.status(200).send(
    sendResponse({
      message: "condition created successfully",
      content: savedProduct,
      success: true,
    })
  );
};

exports.getMyProducts = async (req, res) => {
  let userId = req.userId;
  const products = await productService.fetchMyProduct(userId);

  if (!products.length) {
    throw productError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "products successfully loaded",
      content: { productCount: products.length, Allproduct: products },
      success: true,
    })
  );
};

exports.getAllProductByAdmin = async (req, res) => {
  //   let userId = req.userId;
  const products = await productService.fetchProductsByAdmin();

  if (products.length < 1) {
    throw productError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "products successfully loaded",
      content: { productCount: products.length, Allproduct: products },
      success: true,
    })
  );
};

exports.getSingleProduct = async (req, res) => {
  try {
    let productId = req.params.id;

    if (isEmpty(productId)) {
      throw productError.NotFound("Please specify a product to delete");
    }

    const product = await productService.fetchSingleProduct(productId);

    if (product.status === "inactive" || product.isAvailable === false) {
      throw productError.NotFound();
    }

    return res.status(200).send(
      sendResponse({
        message: "product updated",
        content: product,
        success: true,
      })
    );
  } catch (error) {
    res.status(500).send({ error, message: "Error finding product" });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw productError.InvalidInput(errors.mapped());
  }

  let updateData = req.body;
  const { productId } = req.params;
  let user = req.userId;
  let isAdmin = req.isAdmin;
  let email = req.email;

  if (isEmpty(productId)) {
    throw productError.NotFound("Please specify a product to edit");
  }

  const findUser = await userService.findUserById(user);

  // if (findUser.isAdmin === false) {
  //   throw productError.NotAllowed();
  // }

  const findProduct = await productService.findProductById(productId);
  const productOwner = findProduct.user._id.toString();

  if (user !== productOwner) {
    throw productError.NotFound();
  }

  const query = productId;
  const userId = user;
  const update = updateData;

  // if(productuser !== userId){
  //   throw productError.NotAllowed()
  // }

  let editedProduct = await productService.editProduct(query, userId, update);

  if (!editedProduct) {
    throw productError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "product updated",
      content: editedProduct,
      success: true,
    })
  );
};

exports.deleteProduct = async (req, res) => {
  const errors = validationResult(req);

  let deleteData = req.body.status;
  const { productId } = req.params;
  let user = req.userId;

  console.log("PRODUCTiD", productId);
  console.log("USER ID", user);

  if (isEmpty(productId)) {
    throw productError.NotFound("Please specify a product to delete");
  }

  const findUser = await userService.findUserById(user);

  // if (findUser.isAdmin === false) {
  //   throw productError.NotAllowed();
  // }

  const findProduct = await productService.findProductById(productId);
  const productOwner = findProduct.user._id.toString();

  if (findProduct.status === "inactive" || findProduct.isAvailable === false) {
    throw productError.Inactive();
  }

  if (user !== productOwner) {
    throw productError.NotFound();
  }

  const query = productId;
  const userId = user;
  const update = deleteData;

  let deletedProduct = await productService.deleteOneProduct(
    query,
    userId,
    update
  );

  if (!deletedProduct) {
    throw productError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "product updated",
      content: deletedProduct,
      success: true,
    })
  );
};
