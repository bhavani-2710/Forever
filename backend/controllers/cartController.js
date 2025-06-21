import userModel from '../models/userModel.js';

// Add products to User cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size } = req.body;

    const user = await userModel.findById(userId);
    let cartData = await user.cartData;

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({ success: true, message: 'Added to Cart!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update products in User cart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    const user = await userModel.findById(userId);
    let cartData = await user.cartData;

    cartData[productId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    const cartData = await user.cartData;

    return res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
