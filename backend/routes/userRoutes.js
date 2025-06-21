import express from 'express';
import { adminLogin, isLoggedIn, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import adminAuth from '../middlewares/adminAuth.js';
import userAuth from '../middlewares/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.post('/admin', adminLogin);

userRouter.get('/check-admin-auth', adminAuth, isLoggedIn);
userRouter.get('/check-auth', userAuth, isLoggedIn);

export default userRouter;
