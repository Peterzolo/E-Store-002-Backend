import mongoose from 'mongoose';
import {
  deleteProduct,
  fetchAllProducts,
  findProductById,
  findProductOwnerById,
  updateProduct,
} from './product.dao.js';
import { createProduct } from './product.service.js';
import ApiError from '../../error/ApiError.js';
import { findUserById } from '../user/user.dao.js';
import Product from './product.model.js';


export const postProduct = async (req, res) => {
  try {
    const {
      vendor,
      name,
      image,
      category,
      model,
      color,
      description,
      price,
      stockCount,
      brand,
      reviews,
      rating,
      createdAt,
      status,
    } = req.body;

    const dataObject = {
      vendor,
      name,
      image,
      category,
      model,
      color,
      description,
      price,
      stockCount,
      brand,
      reviews,
      rating,
      status,
      createdAt: new Date().toString(),
    };
    // const sender = req.userId;
    const productData = await createProduct(dataObject);
    res.status(200).json({
      success: true,
      message: 'Product successfully created',
      data: productData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await fetchAllProducts();
    if (!allProducts.length) {
      throw ApiError.notFound({ message: "No data found" });
    }
    res.status(200).json({
      dataCount: allProducts.length,
      success: true,
      message: "Successfully fetched all local Product",
      data: allProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////

// export const getAllProducts = async (req, res) => {
//   const { page } = req.query;
//   try {
   
//     const limit = 6;
//     const startIndex = (Number(page) - 1) * limit;
//     const total = await Product.countDocuments({});
//     const Products = await Product.find().limit(limit).skip(startIndex);
//     res.json({
//       data: Products,
//       currentPage: Number(page),
//       totalProducts: total,
//       numberOfPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(404).json({ message: 'Something went wrong' });
//   }
// };

///////////////////////////////////////////////////////////////////

export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await findProductById(id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   throw ApiError.notFound({ message: "Invalid product id" });
    // }

    // if(id !== product._id.toString()){
    //   throw ApiError.notFound({ message: "Invalid product id" });  
    // }

    if (!product) {
      throw ApiError.notFound({ message: "Product Not found" });
    }
    res.status(200).json({
      success: true,
      message: 'Successfully fetched local Product',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { Product } = req.params;
    const userId = req.userId._id;
    const updateData = req.body;
    const findProduct = await findProductById(Product);

    if (findProduct.status === 'inactive') {
      throw ApiError.notFound({ message: 'Product not found' });
    }

    const query = Product;
    const user = userId;
    const update = updateData;

    let editedProduct = await updateProduct(query, user, update);

    if (!editedProduct) {
      throw ApiError.notFound({ message: 'Product not available' });
    }
    return res.status(200).send({
      message: 'Product updated successfully',
      content: editedProduct,
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removeProduct = async (req, res) => {
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

    const findProduct = await findProductById(id);

    if (findProduct.status === 'inactive') {
      throw ApiError.notFound({ message: 'Product not found' });
    }

    const query = id;
    const user = userId;

    let deletedProduct = await deleteProduct(query, user);

    if (!deletedProduct) {
      throw ApiError.notFound({ message: 'Product not available' });
    }
    return res.status(200).send({
      message: 'Product deleted successfully',
      content: deletedProduct,
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const findProductByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userProduct = await findProductOwnerById(id);
    if (userProduct.length < 1) {
      throw ApiError.notFound({ message: 'Product could not be found' });
    }
    res.status(200).json({
      Success: true,
      Message: 'Product successfully fetched',
      data: userProduct,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const searchProductByTitle = async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const title = new RegExp(searchQuery, "i");
//     const Products = await fetchAllProducts({ title });
//     res.status(200).json(Products);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

export const searchProductByTitle = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, 'i');
    const Products = await Product.find({ title });
    res.json(Products);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getProductsByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const Products = await Product.find({ tags: { $in: tag } });
    res.json({
      success: true,
      message: 'Successful',
      data: Products,
    });
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getRelatedProducts = async (req, res) => {
  const tag = req.body;
  try {
    const Products = await Product.find({ tags: { $in: tag } });
    res.json({
      success: true,
      message: 'Successful',
      data: Products,
    });
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

export const getProductLikes = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: 'User is not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Product exist with id: ${id}` });
    }

    const Product = await Product.findById(id);

    const index = Product.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      Product.likes.push(req.userId);
    } else {
      Product.likes = Product.likes.filter((id) => id !== String(req.userId));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, Product, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully liked',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
