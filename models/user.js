// installed packages
const mongoose  = require('mongoose');

// files imported
const Book = require('./book');

const Schema = mongoose.Schema;

// Designing the user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]
})

module.exports = mongoose.model('User', userSchema);