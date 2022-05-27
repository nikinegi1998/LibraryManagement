const express = require('express');
const { check, body } = require('express-validator')

const booksController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', booksController.getBooks)

router.get('/:id', booksController.getBook)

router.post('/add-book', isAuth, isAdmin, [
    body('title')
        .isLength({ min: 3 })
        .withMessage('Should be at least 3 characters'),
    body('isbn')
        .isNumeric()
        .withMessage('Should be a number'),
    body('author')
        .isLength({ min: 5 })
        .withMessage('Should be at least 5 characters'),
    body('yop')
        .isDate()
        .withMessage('Enter valid date format'),
    body('publisher')
        .isLength({ min: 5 })
        .withMessage('Should be at least 5 characters')
], booksController.postAddBook)

router.put('/edit-book/:id', isAuth, isAdmin, booksController.postUpdateBook)

router.delete('/delete-book/:id', isAuth, isAdmin, booksController.removeBook)

router.put('/favorite/:id', isAuth, booksController.addToFav)

router.delete('/favorite/:id', isAuth, booksController.removeFromFav)

module.exports = router;