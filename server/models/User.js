//server/models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      default: null,
      //sparse: true, // sparse index lagao — null values ke liye unique constraint ignore hoga
      unique: false, 
      trim: true,
    },
    password: {
      type: String,
      default: null, //Google OAuth user ka password nahi hoga, isliye default null set kar diya
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin"],
      default: "user",
    },
    //Google OAuth ke liye additional fields
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    //Security fields
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
); // createAt aur updatedAt automatically

// Virtual - account locked hai ya nahi
UserSchema.virtual("isLocked").get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

module.exports = mongoose.model("User", UserSchema);
