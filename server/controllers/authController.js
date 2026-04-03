// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateTokens = require('../utils/generateTokens');
const setCookie = require('../utils/setCookie');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { MAX_FAILED_ATTEMPTS, LOCK_DURATION_MS } = require('../constants/auth.constants');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 1. kya user already exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }

    // 2. password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. user banao
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    // 4. tokens banao
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // 5. refresh token cookie mein daalo
    setCookie(res, refreshToken);

    // 6. response bhejo
    return successResponse(res, 201, 'Registered successfully!', {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. user dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // 2. account locked hai?
    if (user.isLocked) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return errorResponse(res, 423, `Account locked. Try again in ${minutesLeft} minutes.`);
    }

    // 3. password check karo
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // attempts increment karo
      const newAttempts = user.failedLoginAttempts + 1;
      const updateData = {
        failedLoginAttempts: newAttempts,
      };

      // 5 attempts ho gaye? Lock karo
      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        updateData.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      }

      await User.findByIdAndUpdate(user._id, updateData);

      const attemptsLeft = MAX_FAILED_ATTEMPTS - newAttempts;
      return errorResponse(res, 401,
        attemptsLeft > 0
          ? `Invalid credentials. ${attemptsLeft} attempts remaining.`
          : 'Account locked for 24 hours.'
      );
    }

    // 4. success — counter reset karo
    await User.findByIdAndUpdate(user._id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    // 5. tokens banao
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // 6. cookie set karo
    setCookie(res, refreshToken);

    // 7. response bhejo
    return successResponse(res, 200, 'Login successful!', {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── LOGOUT ──
exports.logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return successResponse(res, 200, 'Logged out successfully!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── REFRESH TOKEN ──
exports.refreshToken = async (req, res) => {
  try {
    // 1. cookie se refresh token lo
    const token = req.cookies.refreshToken;
    if (!token) {
      return errorResponse(res, 401, 'No refresh token found');
    }

    // 2. verify karo
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 3. user dhundo
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 401, 'User not found');
    }

    // 4. naya access token banao
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // 5. naya refresh token cookie mein daalo — token rotation
    setCookie(res, refreshToken);

    return successResponse(res, 200, 'Token refreshed!', { accessToken });

  } catch (error) {
    return errorResponse(res, 401, 'Invalid refresh token');
  }
};

// ── GOOGLE AUTH ──
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// ── GOOGLE CALLBACK ──
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // tokens banao
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // cookie set karo
    setCookie(res, refreshToken);

    // React app pe redirect karo — accessToken URL mein bhejo
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);

  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// ── COMPLETE PROFILE ──
exports.completeProfile = async (req, res) => {
  try {
    const { mobile } = req.body;
    const userId = req.user.userId;

    // mobile already kisi aur ka toh nahi?
    const existing = await User.findOne({ mobile });
    if (existing && existing._id.toString() !== userId) {
      return errorResponse(res, 400, 'Mobile number already registered');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { mobile },
      { new: true } // updated user return karo
    );

    return successResponse(res, 200, 'Profile complete!', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      }
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


// ── FORGOT PASSWORD ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const crypto = require('crypto');
    const sendEmail = require('../utils/sendEmail');
    const { RESET_TOKEN_EXPIRY } = require('../constants/auth.constants');

    // 1. user dhundo
    const user = await User.findOne({ email });
    if (!user) {
      // same message — user enumeration rokne ke liye
      return successResponse(res, 200, 'Agar email registered hai toh link bhej diya gaya hai.');
    }

    // 2. random token banao
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. hash karke save karo — plain token kabhi DB mein mat rakho
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + RESET_TOKEN_EXPIRY;
    await user.save();

    // 4. email bhejo
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      'Password Reset — MainsPortal',
      `
        <h2>Password Reset Request</h2>
        <p>Yeh link 10 minutes mein expire ho jaayega.</p>
        <a href="${resetURL}" style="padding:10px 20px;background:blue;color:white;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>Agar tumne request nahi ki toh ignore karo.</p>
      `
    );

    return successResponse(res, 200, 'Password reset link email pe bhej diya gaya hai!');

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
// ── RESET PASSWORD ──
exports.resetPassword = async (req, res) => {
  try {
    const crypto = require('crypto');
    const { token } = req.params;
    const { password } = req.body;

    // 1. token hash karo — DB mein hashed hai
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. user dhundo — token match karo + expire check
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // abhi tak expire nahi hua?
    });

    if (!user) {
      return errorResponse(res, 400, 'Token invalid ya expire ho gaya!');
    }

    // 3. naya password hash karo
    user.password = await bcrypt.hash(password, 10);

    // 4. token clear karo
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    // 5. authProvider mein local add karo agar nahi hai
    if (!user.authProvider.includes('local')) {
      user.authProvider = 'local';
    }

    await user.save();

    return successResponse(res, 200, 'Password reset successful! Ab login karo.');

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};