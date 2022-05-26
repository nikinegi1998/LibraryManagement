const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getUsers)

router.get('/:id', userController.getUser)

router.get('/wishlist/books', userController.getAllFavList)

router.post('/add-user', userController.postAddUser)

router.put('/edit-user/:id', userController.postUpdateUser)

router.delete('/delete-user/:id', userController.removeUser)

module.exports = router;