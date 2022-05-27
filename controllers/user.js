const { validationResult } = require('express-validator');

const Users = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postAddUser = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({message: 'Validation error'})
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    Users.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.status(422).json({ message: 'User already exist' })
            }
            return bcrypt.hash(password, 12)
        })
        .then(hashedPass => {
            const user = new Users({
                name: name,
                email: email,
                password: hashedPass,
                role: role
            })
            return user.save();
        })
        .then(success => {
            res.status(200).json({
                message: 'User created',
                users: success
            })
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).json({ message: 'Saving user failed' });
        })
}

exports.loginUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({message: 'Validation error'})
    }
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found.' })
            }

            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.user = user
                        req.session.isLoggedIn = true
                        return req.session.save()
                    }
                    res.status(404).json({ message: 'Password incorrect' })
                })
                .then(success => {
                    res.status(200).json({ message: 'Logged in successfully.' })
                })
                .catch(err => {
                    return res.status(500).json({ message: 'Error occurred' })
                })
        })
        .catch(err => {
            return res.status(500).json({ message: 'Error occurred' })
        })
}

// exports.postUpdateUser = (req, res, next) => {
//     const uId = req.params.id;
//     const name = req.body.name;

//     Users.findById(uId)
//         .then(user => {
//             if (!user) {
//                 throw new Error({ message: 'User doesn\'t exist.', status: 404 });
//             }
//             user.name = name
//             user.email = user.email,
//             user.password = user.password,
//             user.role = role
//             return user.save()
//         })
//         .then(success => {
//             console.log('User Updated');
//             return res.status(200).json({
//                 message: 'User details Updated'
//             })
//         })
//         .catch(err => {
//             res.status(500).json({ message: 'Updating users failed' });
//         })
// }

exports.getAllFavList = (req, res, next) => {
    const user = req.user;
    console.log(user);

    if (!user) {
        throw new Error('user not logged in');
    }
    Users.findById({ _id: user._id })
        .then(usr => {
            console.log(usr);

            if (!usr) {
                throw new Error('user not found');
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
        })
        .catch(err => {
            console.log(err.message);
        })
}

