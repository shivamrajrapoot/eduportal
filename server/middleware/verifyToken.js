// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const verifyToken = (req, res, next) => {
  try {
    // 1. header se token lo
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return errorResponse(res, 401, 'Access token not found');
    }

    // 2. verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. req mein user daalo — aage use hoga
    req.user = decoded;

    next(); // aage jao

  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token');
  }
};

module.exports = verifyToken;