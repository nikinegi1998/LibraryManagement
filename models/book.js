// installed packages
const mongoose  = require('mongoose');

// files imported
const Book = require('./user')

const Schema = mongoose.Schema;

// designing the book schema
const booksSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: Number,
        required: true
    },    
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    yop: {
        type: Date,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Book', booksSchema)