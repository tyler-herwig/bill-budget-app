const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/auth', authRoutes);

mongoose.set("strictQuery", false)
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(5038, () => {
            console.log('Node API app is running on port 5038')
        })
    })
    .catch((error) => {
        console.log(error)
    })