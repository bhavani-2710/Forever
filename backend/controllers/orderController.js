import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import razorpay from 'razorpay';
import crypto from 'crypto';

// GLOBAL VARIABLES
const CURRENCY = 'inr';
const DELIVERY_CHARGES = 10;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Place order using Cash On Delivery (COD) method
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now()
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({ success: true, message: 'Order Placed!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now()
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: DELIVERY_CHARGES * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/orders`,
      cancel_url: `${origin}/cart`,
      line_items,
      mode: 'payment',
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      }
    });

    return res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'Razorpay',
      payment: false,
      date: Date.now()
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: CURRENCY.toUpperCase(),
      notes: {
        orderId: newOrder._id,
        userId
      },
      receipt: `receipt_${newOrder._id}`
    };
    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
      }
      return res.status(200).json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook for clearing the cartData and payment: true on successfull payment
const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId;

    if (orderId) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }
  }

  res.status(200).json({ success: true });
};

// Webhook for clearing the cartData and payment: true on successfull payment
const webhookRazorpay = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(req.body);
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = JSON.parse(req.body);
    console.log(event)
    if (event.event === 'payment.captured') {
      const orderId = event.payload.payment.entity.notes.orderId;
      const userId = event.payload.payment.entity.notes.userId;

      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.status(200).json({ success: true });
  } else {
    res.status(403).json({ success: false, message: 'Invalid Signature' });
  }
};

// All Orders Data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    return res.status(200).json({ success: true, message: 'Status Updated!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, webhookStripe, webhookRazorpay };
