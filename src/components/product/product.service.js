import {
  findProductById,
  findProductByName,
  saveProductPayload,
} from "./product.dao.js";
import ApiError from "../../error/ApiError.js";

export const createProduct = async ({
 
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
}) => {
  const productObject = {
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
  };

  const productExists = await findProductByName({ name });

  if (productExists) {
    throw ApiError.productExists("Product with this name has already been posted");
  }

  const product = await saveProductPayload(productObject);
  return {
   
    createdAt: new Date().toISOString(),
    vendor: product.vendor,
    name: product.name,
    image: product.image,
    category: product.category,
    model: product.model,
    color: product.color,
    description: product.status,
    price: product.price,
    stockCount: product.stockCount,
    brand: product.brand,
    reviews: product.reviews,
    rating: product.rating,
    status: product.status,
    // createdAt: product.createdAt,
    _id: product._id,
  };
};
