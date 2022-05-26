const express = require('express');

const booksController = require('../controllers/book');

const router = express.Router();

router.get('/', booksController.getBooks)

router.get('/details/:id', booksController.getBook)

router.post('/add-book', booksController.postAddBook)

router.put('/edit-book/:id', booksController.postUpdateBook)

router.delete('/delete-book/:id', booksController.removeBook)

router.put('/favorite/:id', booksController.addToFav)

router.delete('/favorite/:id', booksController.removeFromFav)

module.exports = router;