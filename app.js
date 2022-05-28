if (process.env.NOD_ENV !== 'production') {
    require('dotenv').config();
}

// installed packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

// imported files
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const errorRoutes = require('./routes/error')

// models imports
const Users = require('./models/user')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const store = new mongoDbStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

app.use(session({
    secret: 'dbsecret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    Users.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err.message);
        })
})

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
