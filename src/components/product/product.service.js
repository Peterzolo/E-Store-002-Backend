import {
  findProductById,
  findProductByName,
  saveProductPayload,
} from './product.dao.js';
import ApiError from '../../error/ApiError.js';

export const createProduct = async ({
  title,
  image,
  category,
  model,
  color,
  description,
  price,
  brand,
  createdAt,
  status,
}) => {
  const productObject = {
    title,
    image,
    category,
    model,
    color,
    description,
    price,
    brand,
    createdAt,
    status,
  };

  const productExists = await findProductByName({ title });

  if (productExists) {
    throw ApiError.alreadyExists({message :
      'Product with this title has already been created'}
    );
  }

  const product = await saveProductPayload(productObject);
  return {
    createdAt: new Date().toISOString(),
  
    title: product.title,
    image: product.image,
    category: product.category,
    model: product.model,
    color: product.color,
    description: product.status,
    price: product.price,
    brand: product.brand,
    status: product.status,
    _id: product._id,
  };
};
