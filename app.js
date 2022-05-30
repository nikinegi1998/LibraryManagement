if (process.env.NOD_ENV !== 'production') {
    require('dotenv').config();
}

// installed packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

// imported files
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const errorRoutes = require('./routes/error')

// models imports
const Users = require('./models/user')

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// error handling middleware
app.use((error, req, res, next) => {
    if (error.message === "Bad request") {
        res.status(400).json({error: {msg: error.message, stack: error.stack}});
    }
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/books', bookRoutes);
app.use(errorRoutes);

// cors error fixing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Auhtorization');
})

// Database connection
mongoose
    .connect(process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3000, () => {
            console.log('connected');
        })
    })
    .catch(err => {
        console.log(err.message);
    });
