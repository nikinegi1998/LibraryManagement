const express = require('express');

const booksController = require('../controllers/book');

const router = express.Router();

router.get('/', booksController.getBooks)

router.get('/:id', booksController.getBook)

router.post('/add-book', booksController.postAddBook)

router.put('/edit-book/:id', booksController.postUpdateBook)

router.delete('/delete-book/:id', booksController.removeBook)

module.exports = router;