// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. pehle check karo — Google ID se user exist karta hai?
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // user already hai — seedha login
        return done(null, user);
      }

      // 2. same email se koi local user hai?
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // email match hua — Google ID link kar do
        user.googleId = profile.id;
        user.authProvider = 'google';
        await user.save();
        return done(null, user);
      }

      // 3. bilkul naya user — banao
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        authProvider: 'google',
        mobile: null,
        password: null,
      });

      return done(null, user);

    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;