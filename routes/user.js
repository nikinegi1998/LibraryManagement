// Importing Installed packages
const express = require('express');
const { check, body } = require('express-validator')

// Db Models imported
const Users = require('../models/user');

// Controllers and middleware imported
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// All users signup route
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

// All users lgoin route
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email id')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], userController.loginUser)

// Authenticated user's add to wishlist route
router.patch('/add-favorite/:id', isAuth, userController.addToFav)

// Authenticated user's remove from wishlist route
router.patch('/remove-favorite/:id', isAuth, userController.removeFromFav)

// Authenticated user's wishlist route
router.get('/wishlist/books', isAuth, userController.getAllFavList)

// exporting all the routes
module.exports = router;