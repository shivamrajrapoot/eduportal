// server/utils/generateTokens.js
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../constants/auth.constants');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;