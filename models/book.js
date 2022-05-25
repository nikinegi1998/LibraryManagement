const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

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
    }
})

module.exports = mongoose.model('Book', booksSchema)