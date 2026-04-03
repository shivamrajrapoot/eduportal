// server/constants/auth.constants.js

module.exports = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCK_DURATION_MS: 24 * 60 * 60 * 1000,  // 24 hours
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  RESET_TOKEN_EXPIRY: 10 * 60 * 1000,      // 10 minutes
};