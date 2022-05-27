const express = require('express');
const { check, body } = require('express-validator')

const Users = require('../models/user');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', [
    body('name')
        .isLength({ min: 4 })
        .isString()
        .withMessage('name should be of at least 4 characters')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return Users.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-Mail exists already, try another one.');
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], userController.postAddUser)

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email id')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], isAuth, userController.loginUser)

// router.put('/edit-user/:id', isAuth, userController.postUpdateUser)

router.get('/wishlist/books', isAuth, userController.getAllFavList)

module.exports = router;