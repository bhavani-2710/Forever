import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized! Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Not Authorized!' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default adminAuth;
