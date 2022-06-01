// Importing Installed packages
const { validationResult } = require('express-validator');

// Importing database model
const Books = require('../models/book');
const Users = require('../models/user')

// Fetching all the books
exports.getBooks = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemsPerPage = 3;
    
    try {
        const totalbooks = await Books.find().countDocuments()
        
        const booksList = await Books.find()
        .skip((currentPage-1)*itemsPerPage)
        .limit(itemsPerPage)

        if (!booksList) {
            const error = new Error('Books not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Books List',
            books: booksList,
            totalbooks: totalbooks
        })
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Fetch data of a book with given id
exports.getBook = async (req, res, next) => {
    const bId = req.params.id;

    try {
        const book = await Books.findById(bId)

        if (!book) {
            const error = new Error('Book not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Book Found',
            books: book
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Create new book
exports.postAddBook = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;
    const user = req.user;

    try {
        const existingBook = await Books.findOne({ isbn: isbn })

        if (existingBook) {
            const error = new Error('Book with this isbn already exist');
            error.statusCode = 409;
            throw error;
        }
        const book = new Books({
            title: title,
            isbn: isbn,
            author: author,
            genre: genre,
            yop: yop,
            publisher: publisher,
            userId: user.userId
        })

        await book.save()
        res.status(200).json({
            message: 'Book created',
            books: book
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Updates book details
exports.postUpdateBook = async (req, res, next) => {
    const bId = req.params.id;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;
    const user = req.user;

    try {
        const book = await Books.findById(bId)

        if (!book) {
            const error = new Error('Book doesn\'t exist');
            error.statusCode = 404;
            throw error;
        }

        // if (user._id !== book.userId) {
        //     const error = new Error('User not authorized to update');
        //     error.statusCode = 401;
        //     throw error;
        // }

        book.title = title;
        book.isbn = isbn;
        book.author = author;
        book.genre = genre;
        book.yop = yop;
        book.publisher = publisher;
        book.userId = book.userId;

        await book.save();

        console.log('Book Updated');
        return res.status(200).json({
            message: 'Book details Updated',
            book: book
        })
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Deletes book
exports.removeBook = async (req, res, next) => {
    const bId = req.params.id;

    const book = await Books.findById(bId)
    try {

        if (!book) {
            const error = new Error('Book doesn\'t exist.');
            error.statusCode = 404;
            throw error;
        }
        // if (book.userId !== req.user._id) {
        //     const error = new Error('User not authorized to update');
        //     error.statusCode = 401;
        //     throw error;
        // }

        await Books.deleteOne({ _id: bId })

        return res.status(200).json({
            message: 'Book Deleted'
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Search books with the keyword
exports.searchWithKeyword = async (req, res, next) => {
    const keyword = req.params.keyword;

    const bookList = [];
    try {
        const book = await Books.find({
            $or: [
                { title: { '$regex': keyword, $options: 'i' } },
                { author: { '$regex': keyword, $options: 'i' } },
                { genre: { '$regex': keyword, $options: 'i' } },
                { publisher: { '$regex': keyword, $options: 'i' } }
            ]
        })
        
        bookList.push(book)
        console.log(bookList);
        res.status(200).json({
            message: 'Fetched books from the keywords',
            books: bookList
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}