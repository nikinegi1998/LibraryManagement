const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', userController.postAddUser)

router.post('/login', isAuth, userController.loginUser)

// router.put('/edit-user/:id', isAuth, userController.postUpdateUser)

router.get('/wishlist/books', isAuth, userController.getAllFavList)

module.exports = router;