// server/controllers/userController.js
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── GET PROFILE ──
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('name email mobile role authProvider createdAt');

    if (!user) return errorResponse(res, 404, 'User nahi mila!');

    return successResponse(res, 200, 'Profile fetched!', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE PROFILE ──
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, mobile },
      { new: true }
    ).select('name email mobile role');

    if (!user) return errorResponse(res, 404, 'User nahi mila!');

    return successResponse(res, 200, 'Profile updated!', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};