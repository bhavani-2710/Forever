import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const isLoggedIn = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(200).json({ success: true, message: 'Authenticated' });
    }
  } catch (err) {
    res.status(403).json({ success: false, message: 'Not Authenticated' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const token = createToken(user._id);
      res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 7 days
        ),
        httpOnly: true,
        secure: true
      });
      return res.status(200).json({ success: true, token });
    }

    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,     // true in production
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Please enter a strong password' });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = createToken(email + password);

      res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 7 days
        ),
        httpOnly: true,
        secure: true
      });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { isLoggedIn, loginUser, logoutUser, registerUser, adminLogin };
