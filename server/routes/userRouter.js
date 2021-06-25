import express from 'express';
import { register, refreshToken, login, logout,getUser } from '../controllers/userCtrl.js';
import { auth,authAdmin } from '../middleware/auth.js'

const router = express.Router();

router.post( '/register', register)
router.post( '/login', login)
router.get( '/logout', logout)
router.get( '/refresh_token', refreshToken )
router.get('/infor',auth,getUser)

export default router