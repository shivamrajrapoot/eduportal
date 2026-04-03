// server/middleware/errorHandler.js
const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, status, message);
};

module.exports = errorHandler;