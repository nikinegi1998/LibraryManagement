// installed packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// imported files
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')
const errorRoutes = require('./routes/error')

// models imports
const Users = require('./models/user')

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
const MONGODB_URI = 
'mongodb+srv://nikki:z719yEvUAZwuyxXM@cluster0.130pt.mongodb.net/library?retryWrites=true&w=majority'

app.use((req, res, next)=>{
    Users.findById('628f1762096fd4ff464c72e9')
    .then(user =>{
        req.user = user
        next();
    })
    .catch(err=>{
        console.log(err.message);
    })
})

app.use('/user', userRoutes);
app.use('/book', bookRoutes);
app.use(errorRoutes);

// Database connection
mongoose
    .connect(MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3000, () => {
            console.log('connected');
        })
    })
    .catch(err => {
        console.log(err.message);
    });
