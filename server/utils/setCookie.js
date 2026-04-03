// server/utils/setCookie.js

const setCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,   // JS read nahi kar sakta — XSS safe
    secure: process.env.NODE_ENV === 'production', // HTTPS only production mein
    sameSite: 'strict', // CSRF safe
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

module.exports = setCookie;