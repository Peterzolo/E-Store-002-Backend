import express from 'express';
// import upload from "../../utils/multer.js"

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
import { upload } from '../../utils/multer.js';

productRouter.post('/create', authorizedAndAdmin,upload.single("image"), postProduct);
productRouter.get('/fetch-all', getAllProducts);
productRouter.get('/fetch-one/:id', getOneProduct);
productRouter.put('/edit/:id', authorizedAndAdmin, editProduct);
productRouter.delete('/remove/:id', authorizedAndAdmin, removeProduct);
productRouter.get('/search', searchProductByTitle);
productRouter.post('/related-products', getRelatedProducts);
productRouter.patch('/like/:id', getProductLikes);

export default productRouter;
