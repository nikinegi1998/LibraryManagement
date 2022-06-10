// Importing Installed packages
const express = require('express');
const { check, body } = require('express-validator')

// Importing controllers and authentication middleware
const booksController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const Roles = require('../data');

const router = express.Router();

// Get All books without authentication
router.get('/', booksController.getBooks)

// Get book details by its id without authentication
router.get('/:id', booksController.getBook)

// Add book by admin after validating inputs
router.post('/add-book', isAuth, isAdmin(Roles.ADMIN), [
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

// Edit book by admin after validating inputs
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
], isAuth, isAdmin(Roles.ADMIN), booksController.postUpdateBook)

// Delete book by admin routes
router.delete('/delete-book/:id', isAuth, isAdmin(Roles.ADMIN), booksController.removeBook)

// Search books with the keyword without authentication
router.get('/search/:keyword', booksController.searchWithKeyword)

module.exports = router;