const express = require('express');
const { check, body } = require('express-validator')

const booksController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', booksController.getBooks)

router.get('/:id', booksController.getBook)

router.post('/add-book', isAdmin, [
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

router.put('/edit-book/:id', [
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
], isAdmin, booksController.postUpdateBook)

router.delete('/delete-book/:id', isAdmin, booksController.removeBook)

router.patch('/add-favorite/:id', isAuth, booksController.addToFav)

router.patch('/remove-favorite/:id', isAuth, booksController.removeFromFav)

router.post('/search', booksController.searchWithKeyword)

module.exports = router;