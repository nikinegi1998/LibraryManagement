// Importing Installed packages
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importing models 
const Users = require('../models/user');
const Book = require('../models/book');
const Roles = require('../data');

// Registers new user
exports.postAddUser = async (req, res, next) => {

    if(req.body.role === ''){
        req.body.role = Roles.USER
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role.toLowerCase();
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const error = new Error('Validation error in register');
        error.statusCode = 422;
        next(error);
    }

    if ((role !== Roles.ADMIN) &&
        (role !== Roles.SUPERADMIN) &&
        (role !== Roles.USER)) {
        const error = new Error('Role can\'t be identified');
        error.statusCode = 422;
        next(error);
    }

    try {
        const userDoc = await Users.findOne({ email: email })

        if (userDoc) {
            const error = new Error('User already exist');
            error.statusCode = 422;
            throw error;
        }
        const hashedPass = await bcrypt.hash(password, 12)
        
        const user = new Users({
            name: name,
            email: email,
            password: hashedPass,
            role: role
        })
        await user.save();

        res.status(200).json({
            message: 'User created',
            users: user
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// Login existing user
exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error in login');
        error.statusCode = 422;
        next(error);
    }
    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await Users.findOne({ email: email })

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 422;
            throw error;
        }

        const result = await bcrypt.compare(password, user.password)

        if (!result) {
            const error = new Error('Password incorrect');
            error.statusCode = 422;
            throw error;
        }
        console.log(user);
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString(),
            role: user.role
        }, 'somesupersecretsecret', { expiresIn: '1h' })

        res.status(200).json({
            message: 'Logged in successfully.',
            token: token,
            userId: user._id.toString(),
            role: user.role
        })
        return;
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err
    }
}

// Fetching wishlist
exports.getAllFavList = async (req, res, next) => {
    const user = req.user;

    try {

        const usr = await Users.findById({ _id: user.userId })

        console.log(usr);

        if (!usr) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const favList = usr.favourites;

        console.log(favList);
        if (!favList) {
            return res.status(200).json({
                message: 'No books added'
            })
        }

        return res.status(200).json({
            message: 'All favorites book fetched',
            favorites: favList
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Add book to wishlist
exports.addToFav = async (req, res, next) => {
    const bId = req.params.id;
    console.log(req.user);

    try {
        const user = await Users.findById({ _id: req.user.userId })

        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 422;
            throw error;
        }

        const book = await Book.findById({_id: bId})
        if (!book) {
            const error = new Error('User not found.');
            error.statusCode = 422;
            throw error;
        }

        if(user.favourites.includes(bId)){
            const error = new Error('Book already exist.');
            error.statusCode = 409;
            throw error;
        }

        user.favourites.push(bId);
        await user.save()

        return res.status(200).json({
            message: 'Successfully added to the wishlist',
            user: user
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Remove book from wishlist
exports.removeFromFav = async (req, res, next) => {
    const bId = req.params.id;
    const user = req.user;

    try {
        const usr = await Users.findById({ _id: user.userId })

        if (!usr) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        usr.favourites.pull(bId);
        await usr.save()


        return res.status(200).json({
            message: 'Successfully removed from the wishlist',
            user: usr
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
