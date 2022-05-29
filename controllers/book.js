const { validationResult } = require('express-validator');

const Books = require('../models/book');
const Users = require('../models/user')

exports.getBooks = async (req, res, next) => {

    try {
        const booksList = await Books.find()

        if (!booksList) {
            const error = new Error('Books not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Books List',
            books: booksList
        })
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

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

        if (user._id !== book.userId) {
            const error = new Error('User not authorized to update');
            error.statusCode = 401;
            throw error;
        }

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

exports.removeBook = async (req, res, next) => {
    const bId = req.params.id;

    const book = await Books.findById(bId)
    try {

        if (!book) {
            const error = new Error('Book doesn\'t exist.');
            error.statusCode = 404;
            throw error;
        }
        if (book.userId !== req.user._id) {
            const error = new Error('User not authorized to update');
            error.statusCode = 401;
            throw error;
        }

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

exports.addToFav = async (req, res, next) => {
    const bId = req.params.id;
    console.log(req.user);

    try {
        const user = await Users.findById({ _id: req.user.userId })

        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        user.favourites.push(bId);
        await user.save()

        return res.status(200).json({
            message: 'Successfully added to the wishlist',
            user: user
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.removeFromFav = async (req, res, next) => {
    const bId = req.params.id;
    const user = req.user;

    try {
        const usr = await Users.findById({ _id: user.userId })

        if (!usr) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        usr.favourites.pull(bId);
        await usr.save()


        return res.status(200).json({
            message: 'Successfully removed from the wishlist',
            user: usr
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.searchWithKeyword = async (req, res, next) => {
    const keyword = req.body.keyword;

    const bookList = [];
    const duplicates = [];

    try {
        const titleSearch = await Books.find({ "title": { "$regex": keyword } },
            (err, docs) => {
                if (!err) {
                    docs.forEach(element => {
                        duplicates.push(element)
                        console.log(element)
                    });

                }
            });

        const authorSearch = await Books.find({ "author": { "$regex": keyword } },
            (err, docs) => {
                if (!err) {
                    docs.forEach(element => {
                        duplicates.push(element)
                        console.log(element)
                    });

                }
            });

        const genreSearch = await Books.find({ "genre": { "$regex": keyword } },
            (err, docs) => {
                if (!err) {
                    docs.forEach(element => {
                        duplicates.push(element)
                        console.log(element)
                    });

                }
            });

        const publisherSearch = await Books.find({ "publisher": { "$regex": keyword } },
            (err, docs) => {
                if (!err) {
                    docs.forEach(element => {
                        duplicates.push(element)
                        console.log(element)
                    });

                }
            });

        duplicates.forEach((c) => {
            if (!bookList.includes(c)) {
                bookList.push(c);
                console.log(c)
            }
        });

        console.log(bookList);
        res.status(200).json({
            message: 'Fetched books from the keywords',
            books: bookList
        })

        // Books.find({"author": { "$regex": keyword }},
        // (err, docs)=>{
        //     if(err){
        //         console.log(err);
        //     }
        //     if(docs){
        //         docs.forEach(element => {
        //             duplicates.push(element)
        //         });
        //     }  
        // })

        // Books.find({"genre": { "$regex": keyword }},
        // (err, docs)=>{
        //     if(err){
        //         console.log(err);
        //     }
        //     if(docs){
        //         docs.forEach(element => {
        //             duplicates.push(element)
        //         });
        //     }  
        // })

        // Books.find({"publisher": { "$regex": keyword }},
        // (err, docs)=>{
        //     if(err){
        //         console.log(err);
        //     }
        //     if(docs){
        //         docs.forEach(element => {
        //             duplicates.push(element)
        //         });
        //     }  
        // })

        // duplicates.forEach((c) => {
        //     if (!bookList.includes(c)) {
        //         bookList.push(c);
        //         console.log(c)
        //     }
        //     console.log(c)
        // });
        // console.log(bookList);

        // res.status(200).json({
        //     message: 'Fetched books from the keywords',
        //     books: duplicates
        // })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}