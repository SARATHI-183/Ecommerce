import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { createProduct, deleteProduct, fetchAllProducts, fetchSingleProduct } from '../Controller/Product.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router();
router.post("/product/new",isAuth ,uploadFiles ,createProduct);
router.get('/product/all-products',fetchAllProducts);
router.get('/product/single/:id',fetchSingleProduct);
router.delete('/product/:id',isAuth,deleteProduct);

export default router;