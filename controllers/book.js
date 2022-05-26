const Books = require('../models/book');

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
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const genre = req.body.genre;
    const yop = req.body.yop;
    const publisher = req.body.publisher;

    const book = new Books({
        title : title,
        isbn : isbn,
        author : author,
        genre : genre,
        yop : yop,
        publisher : publisher
    })

    book.save()
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

    Books.findById(bId)
    .then(book=>{
        if(!book){
            throw new Error({message: 'Book doesn\'t exist.', status: 404});
        }
        book.title = title;
        book.isbn = isbn;
        book.author = author;
        book.genre = genre;
        book.yop = yop;
        book.publisher = publisher;
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