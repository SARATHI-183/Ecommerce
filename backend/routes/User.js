import express from 'express'
import { loginUser, registerUser, userProfile, verifyUser } from '../controller/User.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post('/user/register',registerUser);
router.post('/user/verify',verifyUser);
router.post('/user/login',loginUser);
router.get('/user/profile', isAuth ,userProfile);

export default router;