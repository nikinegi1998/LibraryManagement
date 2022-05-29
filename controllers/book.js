const { validationResult } = require('express-validator');

const Books = require('../models/book');
const Users = require('../models/user')

exports.getBooks = (req, res, next) => {
    Books.find()
        .then(booksList => {
            if (!booksList) {
                const error = new Error('Books not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Books List',
                books: booksList
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getBook = (req, res, next) => {
    const bId = req.params.id;

    Books.findById(bId)
        .then(book => {
            if (!book) {
                const error = new Error('Book not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Book Found',
                books: book
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.postAddBook = (req, res, next) => {
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

    Books.findOne({ isbn: isbn })
        .then(existingBook => {
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

            return book.save()
        })
        .then(bookData => {

            if (!bookData) {
                const error = new Error('Failed to save the book data');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({
                message: 'Book created',
                books: bookData
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.postUpdateBook = (req, res, next) => {
    const bId = req.params.id;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;
    const user = req.user;

    Books.findById(bId)
        .then(book => {
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
            book.userId = user._id;
            return book.save()
        })
        .then(success => {
            if (!success) {
                const error = new Error('Failed to save the updates');
                error.statusCode = 500;
                throw error;
            }
            console.log('Book Updated');
            return res.status(200).json({
                message: 'Book details Updated'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.removeBook = (req, res, next) => {
    const bId = req.params.id;

    Books.findById(bId)
        .then(book => {
            if (!book) {
                const error = new Error('Book doesn\'t exist.');
                error.statusCode = 404;
                throw error;
            }
            return Books.deleteOne({ _id: bId })
        })
        .then(success => {
            console.log('Book destroyed');
            return res.status(200).json({
                message: 'Book Deleted'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.addToFav = (req, res, next) => {
    const bId = req.params.id;
    const user = req.user;

    Users.findById({ _id: user._id })
        .then(usr => {
            if (!usr) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }

            usr.favourites.push(bId);
            return usr.save()
        })
        .then(result => {
            if (!result) {
                const error = new Error('Failed to add book to the wishlist');
                error.statusCode = 500;
                throw error;
            }
            return res.status(200).json({
                message: 'Successfully added to the wishlist',
                user: user
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.removeFromFav = (req, res, next) => {
    const bId = req.params.id;
    const user = req.user;

    Users.findById({ _id: user._id })
        .then(usr => {
            if (!usr) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            usr.favourites.pull(bId);
            return usr.save()
        })
        .then(result => {
            if (!result) {
                const error = new Error('Failed to remove book from wishlist');
                error.statusCode = 500;
                throw error;
            }
            return res.status(200).json({
                message: 'Successfully removed from the wishlist',
                user: user
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
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