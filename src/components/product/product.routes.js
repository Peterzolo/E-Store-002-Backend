import express from 'express';

const productRouter = express.Router();

import {
  editProduct,
  getAllProducts,
  getProductLikes,
  getOneProduct,
  getRelatedProducts,
  postProduct,
  removeProduct,
  searchProductByTitle,
} from './product.controller.js';
import { authorizedAndAdmin, protect } from '../../middleware/auth2.js';

productRouter.post('/create', authorizedAndAdmin, postProduct);
productRouter.get('/fetch-all', getAllProducts);
productRouter.get('/fetch-one/:id', getOneProduct);
productRouter.put('/edit/:id', authorizedAndAdmin, editProduct);
productRouter.delete('/remove/:id', removeProduct);
productRouter.get('/search', searchProductByTitle);
productRouter.post('/related-products', getRelatedProducts);
productRouter.patch('/like/:id', getProductLikes);

export default productRouter;
