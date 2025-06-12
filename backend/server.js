const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./src/models");
const artisanRoutes = require('./src/routes/artisan.routes');
const authRoutes = require('./src/routes/auth.routes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Artisans API' });
});

// Import routes
artisanRoutes(app);
authRoutes(app);

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Server is running on port ${PORT}`);
}); 