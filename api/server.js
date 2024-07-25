const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const billRoutes = require('./routes/bill');
const paycheckRoutes = require('./routes/paycheck');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.use('/api/', billRoutes);
app.use('/api/', paycheckRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);

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