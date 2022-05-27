const express = require('express');

const booksController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const isSuper = require('../middleware/is-superadmin');

const router = express.Router();

router.get('/', booksController.getBooks)

router.get('/:id', booksController.getBook)

router.post('/add-book', isAuth, isAdmin, booksController.postAddBook)

router.put('/edit-book/:id', isAuth, isAdmin, booksController.postUpdateBook)

router.delete('/delete-book/:id', isAuth, isAdmin, booksController.removeBook)

router.put('/favorite/:id',isAuth, booksController.addToFav)

router.delete('/favorite/:id', isAuth, booksController.removeFromFav)

module.exports = router;