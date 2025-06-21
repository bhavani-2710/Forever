import express, { Router } from 'express';
import adminAuth from '../middlewares/adminAuth.js';
import userAuth from '../middlewares/userAuth.js';
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

// ADMIN
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.patch('/status', adminAuth, updateStatus);

// PAYMENT FEATURES
orderRouter.post('/place-order', userAuth, placeOrder); // Cash on Delivery
orderRouter.post('/place-order-stripe', userAuth, placeOrderStripe); // Stripe
orderRouter.post('/place-order-razorpay', userAuth, placeOrderRazorpay); // Razorpay

// USER FEATUREs
orderRouter.get('/fetch-orders', userAuth, userOrders);

export default orderRouter;
