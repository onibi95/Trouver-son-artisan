const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./src/models");
const artisanController = require('./src/controllers/artisan.controller');
const categoryController = require('./src/controllers/category.controller');
const { authRouter } = require('./src/controllers/authentification');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/artisans', artisanController);
app.use('/api/categories', categoryController);
app.use('/api/auth', authRouter);


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Artisans API' });
});


// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Server is running on port ${PORT}`);
}); 