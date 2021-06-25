import express from 'express';
import { category,createCategory,deleteCategory,updateCategory } from '../controllers/categoryCtrl.js';
import { authAdmin,auth } from '../middleware/auth.js';
const router = express.Router();

router.route( '/category' )
    .get( category )
    .post(auth,authAdmin,createCategory)

router.route( '/category/:id' )
    .delete(auth,authAdmin,deleteCategory)
    .put(auth,authAdmin,updateCategory)


export default router 