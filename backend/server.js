import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import cookieParser from 'cookie-parser';
import orderRouter from './routes/orderRoutes.js';
import userAuth from './middlewares/userAuth.js';
import { webhookRazorpay, webhookStripe } from './controllers/orderController.js';

// App Configuration
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// WebHooks
app.post('/webhook-stripe', express.raw({ type: 'application/json' }), webhookStripe);
app.post('/webhook-razorpay', express.raw({ type: 'application/json' }), webhookRazorpay);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://forever-frontend-oz5k.onrender.com', 'https://forever-le8z.onrender.com'],
    credentials: true
  })
);
app.use(cookieParser());

// API Endpoints
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
