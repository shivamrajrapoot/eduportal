require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('Server is running on port' + PORT);
        });
    } catch(error) {
        console.error('Failed to connect to DB:', error);
    }
}

startServer();