const { validationResult } = require('express-validator');

const Books = require('../models/book');
const Users = require('../models/user')

exports.getBooks = (req, res, next)=>{
    Books.find()
    .then(booksList=>{
        res.status(200).json({
            message: 'Books List',
            books: booksList
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Fetching books failed' });
    })    
}

exports.getBook = (req, res, next)=>{
    const bId = req.params.id;

    Books.findById(bId)
    .then(book=>{
        if(!book){
            throw new Error({message: 'Book not found.', status: 404});
        }
        res.status(200).json({
            message: 'Book Found',
            books: book
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Book id not found' });
    })    
}

exports.postAddBook =(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({message: 'Validation error'})
    }

    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;
    const user = req.session.user

    Books.findOne({isbn: isbn})
    .then(existingBook=>{
        if(existingBook){
            res.status(409).json({message: 'Book with this isbn already exist'})
        }
        const book = new Books({
            title : title,
            isbn : isbn,
            author : author,
            genre : genre,
            yop : yop,
            publisher : publisher,
            userId : user._id
        })

        return book.save()
    })    
    .then(success=>{
        res.status(200).json({
            message: 'Book created',
            books : book
        })
    })
    .catch(err=>{
        console.log(err.message)
        res.status(500).json({ message: 'Saving book failed' });
    })    
}

exports.postUpdateBook = (req, res, next)=>{
    const bId = req.params.id;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;
    const user = req.session.user;

    Books.findById(bId)
    .then(book=>{
        if(!book){
            throw new Error({message: 'Book doesn\'t exist.', status: 404});
        }

        if(user._id !== book.userId){
            throw new Error({message: 'User not authorized to update', status: 404});
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
    .then(success=>{
        console.log('Book Updated');
        return res.status(200).json({
            message: 'Book details Updated'
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Updating books failed' });
    })    
}

exports.removeBook = (req, res, next)=>{
    const bId = req.params.id;

    Books.findById(bId)
    .then(book=>{
        if(!book){
            throw new Error({message: 'Book doesn\'t exist.', status: 404});
        }
        return Books.deleteOne({_id: bId})
    })
    .then(success=>{
        console.log('Book destroyed');
        return res.status(200).json({
            message: 'Book Deleted'
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Deleting books failed' });
    })    
}

exports.addToFav = (req, res, next) =>{
    const bId = req.params.id;
    const user = req.user;

    if(!user){
        throw new Error('user not logged in');
    }
    Users.findById({_id: user._id})
    .then(usr=>{
        if(!usr){
            throw new Error('user not found');
        }   
        
        usr.favourites.push(bId);
        return usr.save()
    })
    .then(result=>{
        if(!result){
            throw new Error('Error adding to the wishlist');
        }
        return res.status(200).json({
            message: 'Successfully added to the wishlist',
            user: user
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Internal error'
        })
    })
}

exports.removeFromFav = (req, res, next) =>{
    const bId = req.params.id;
    const user = req.user;

    if(!user){
        throw new Error('user not logged in');
    }
    Users.findById({_id: user._id})
    .then(usr=>{
        if(!usr){
            throw new Error('user not found');
        }   
        
        usr.favourites.pull(bId);
        return usr.save()
    })
    .then(result=>{
        if(!result){
            throw new Error('Error removing from the wishlist');
        }
        return res.status(200).json({
            message: 'Successfully removed from the wishlist',
            user: user
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Internal error'
        })
    })
}