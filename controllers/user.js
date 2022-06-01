// Importing Installed packages
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importing models 
const Users = require('../models/user');
const Book = require('../models/book');

// Registers new user
exports.postAddUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error in register');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if ((role.toUpperCase() !== 'ADMIN') &&
        (role.toUpperCase() !== 'SUPER ADMIN') &&
        (role.toUpperCase() !== 'USER')) {
        const error = new Error('Role can\'t be identified');
        error.statusCode = 422;
        throw error;
    }

    try {
        const userDoc = await Users.findOne({ email: email })

        if (userDoc) {
            return res.status(422).json({ message: 'User already exist' })
        }
        const hashedPass = await bcrypt.hash(password, 12)

        const user = new Users({
            name: name,
            email: email,
            password: hashedPass,
            role: role.toUpperCase()
        })
        await user.save();

        res.status(200).json({
            message: 'User created',
            users: user
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Login existing user
exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error in login');
        error.statusCode = 422;
        throw error;
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


// describe('Login Function Testing',
//         function () {
//             it('Should throws an error with code 500 if accessing the database fails',
//                 function (done) {
//                     sinon.stub(User, 'findOne');
//                     User.findOne.throws();

//                     const req = {
//                         body: {
//                             email: 'user1@mail.com',
//                             password: '12345'
//                         }
//                     };
//                     UserController.loginUser(req, {}, () => { }).then(result => {
//                         expect(result).to.be.an('error');
//                         expect(result).to.have.property('statusCode', 500);
//                         done();
//                     });
//                     User.findOne.restore();
//                 });

//             it('Should through an error with code 422 if find the value in database fails', function () {
//                 sinon.stub(User, 'findOne');
//                 User.findOne.throws();
//                 const req = {
//                     body: {
//                         email: 'user1@mail.com',
//                         password: '12345',
//                     }
//                 };
//                 UserController.loginUser(req, {}, () => { }).then(result => {
//                     expect(result).to.be.an('error');
//                     expect(result).to.have.property('statusCode', 422);
//                 });
//                 User.findOne.restore();
//             })
//         })

//     describe('Book add to user\'s wishlist',
//         function () {
//             it('should throw an error 500 if request failed',
//                 function () {
//                     sinon.stub(Book, 'findById');
//                     Book.findById.throws();

//                     const req = {
//                         _id: '628e81089e5831e395803e16',
//                     }

//                     UserController.addToFav(req, {}, () => { })
//                         .then(result => {
//                             expect(result).to.be.an('error');
//                             expect(result).to.have.property('statusCode', 500)
//                         })
//                     Book.findById.restore();
//                 })
//         })

//     describe('Book remove from user\'s wishlist',
//         function () {
//             it('should throw an error 500 if request failed', 
//             function(){
//                 sinon.stub(Book,'findById');
//             Book.findById.throws();
//             const req={
//                 body:{
//                     _id:'abbddbhsdbsf',
//                     userId:'bhsndwbwnbshwsnf'
//                 }
//             };
//             bookController.unmarkBook(req,{},()=>{}).then(result=>{
//                 expect(result).to.be.an('error');
//                 expect(result).to.have.property('statusCode',500);
//             });
//             Book.findById.restore();
//             })
//         })