import mongoose from 'mongoose';
import {
  deleteProduct,
  fetchAllProducts,
  findProductById,
  findProductOwnerById,
  updateProduct,
} from './product.dao.js';
import ApiError from '../../error/ApiError.js';
import { findUserById } from '../user/user.dao.js';
import Product from './product.model.js';
import { createProduct } from './product.service.js';
import cloudinary from '../../utils/cloudinary.js';


export const postProduct = async (req, res) => {
  try {
    const {
      title,
      image,
      cloudinary_id,
      category,
      model,
      color,
      description,
      price,
      brand,
      modelNum,
      createdAt,
      status,
    } = req.body;
    
    const userId = req.user;
   

    if (userId.isAdmin === false) {
      return res.status(402).send({ message: 'You are not authorized' });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('RESULT',result)
    const dataObject = {
      title,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      category,
      model,
      color,
      description,
      price,
      brand,
      modelNum,
      createdAt,
      status,
      createdAt: new Date().toString(),
    };
    const productData = await createProduct(dataObject);
    res.status(200).json({
      success: true,
      message: 'Product successfully created',
      result: productData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await fetchAllProducts();
    if (!allProducts.length) {
      throw ApiError.notFound({ message: 'No Product Found' });
    }
    res.status(200).json({
      numInStock: allProducts.length,
      success: true,
      message: 'Successfully fetched all products',
      result: allProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });   
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const findProduct = await findProductById(id);
    if (findProduct) {
      const product = findProduct;
      res.status(200).send({
        Success: true,
        message: 'Product successfully fetched',
        result: product,
      });
    } else {
      res.status(401).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    res.status(400).send({ message: 'Error has occured' });
  }
};

export const editProduct = async (req, res) => {
  try {
    const userId = req.user;

    if (userId.isAdmin === false) {
      return res.status(402).send({ message: 'You are not authorized' });
    }

    const id = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid Id' });
    }

    const findProduct = await findProductById(id);

    if (findProduct.status === 'inactive') {
      throw ApiError.notFound({ message: 'Product not available' });
    }

    const query = id;
    const update = updateData;

    let editedProduct = await updateProduct(query, update);

    if (!editedProduct) {
      throw ApiError.notFound({ message: 'Could not edit product' });
    }
    return res.status(200).send({
      success: true,
      message: 'Product updated successfully',
      result: editedProduct,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removeProduct = async (req, res) => {
  try {
    const userId = req.user;

    if (userId.isAdmin === false) {
      return res.status(402).send({ message: 'You are not authorized' });
    }

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const findProduct = await findProductById(id);

    if (findProduct.status === 'inactive') {
      throw ApiError.notFound({ message: 'Product not available' });
    }

    const query = id;

    await cloudinary.uploader.destroy(findProduct.cloudinary_id);

    let deletedProduct = await deleteProduct(query);

    if (!deletedProduct) {
      throw ApiError.notFound({ message: 'Could not delete product' });
    }
    return res.status(200).send({
      success: true,
      message: 'Product deleted successfully',
      result: deletedProduct,
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
