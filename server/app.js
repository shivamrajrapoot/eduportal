//server/app.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('./config/passport');
// Test system routes
const testRoutes = require('./routes/testRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const adminRoutes = require('./routes/adminRoutes');



const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admin', adminRoutes);

// Route
app.get('/api/health', (req, res) => {
    res.json({ message: "Server is healthy!" });
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// error handler middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message});

});

module.exports = app; 