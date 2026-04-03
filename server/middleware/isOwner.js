const Course = require("../models/Course");

// ── isOwner Middleware ────────────────────────────────────────────
// Yeh check karta hai ki jo user course edit/delete karna chahta hai
// woh course ka creator hai ya nahi.
// Admin ko bypass milta hai — woh kisi bhi course ko edit kar sakta hai.
// Teacher sirf apna course edit kar sakta hai.

const isOwner = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course nahi mila" });
    }

    // Admin hai? seedha next — koi check nahi
    if (req.user.role === "admin") {
      req.course = course; // controller mein dobara query na karni pade
      return next();
    }

    // Teacher hai? check karo ki yeh uska apna course hai
    if (course.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Sirf apna course edit kar sakte ho",
      });
    }

    req.course = course; // controller mein use hoga
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isOwner;