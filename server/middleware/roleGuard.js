// server/middleware/roleGuard.js
const { errorResponse } = require('../utils/apiResponse');

const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    // verifyToken pehle chalna chahiye — req.user set hona chahiye
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    // user ka role allowed hai?
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied — insufficient role');
    }

    next();
  };
};

module.exports = roleGuard;