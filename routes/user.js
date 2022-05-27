const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, isAdmin, userController.getUsers)

router.get('/:id', isAuth, userController.getUser)

router.post('/signup', userController.postAddUser)

router.post('/login', isAuth, userController.loginUser)

router.put('/edit-user/:id', isAuth, userController.postUpdateUser)

router.delete('/delete-user/:id', isAuth, isAdmin, userController.removeUser)

router.get('/wishlist/books', isAuth, userController.getAllFavList)

router.patch('/grantAdmin/:id', isAuth, isAdmin, userController.grantAdminPermission)

router.patch('/revokeAdmin/:id', isAuth, isAdmin, userController.revokeAdminPermission)

module.exports = router;