const Users = require('../models/user');
const Books = require('../models/book');
const bcrypt = require('bcryptjs');

exports.getUsers = (req, res, next) => {
    Users.find()
        .then(usersList => {
            res.status(200).json({
                message: 'Users List',
                books: usersList
            })
        })
        .catch(err => {
            res.status(500).json({ message: 'Fetching users failed' });
        })
}

exports.getUser = (req, res, next) => {
    const uId = req.params.id;

    Users.findById(uId)
        .then(user => {
            if (!user) {
                throw new Error({ message: 'User not found.', status: 404 });
            }
            res.status(200).json({
                message: 'User Found',
                users: user
            })
        })
        .catch(err => {
            res.status(500).json({ message: 'Book id not found' });
        })
}

exports.postAddUser = (req, res, next) => {
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

exports.postUpdateUser = (req, res, next) => {
    const uId = req.params.id;
    const name = req.body.name;

    Users.findById(uId)
        .then(user => {
            if (!user) {
                throw new Error({ message: 'User doesn\'t exist.', status: 404 });
            }
            user.name = name
            user.email = user.email,
            user.password = user.password,
            user.role = role
            return user.save()
        })
        .then(success => {
            console.log('User Updated');
            return res.status(200).json({
                message: 'User details Updated'
            })
        })
        .catch(err => {
            res.status(500).json({ message: 'Updating users failed' });
        })
}

exports.removeUser = (req, res, next) => {
    const uId = req.params.id;

    Users.findById(uId)
        .then(user => {
            console.log(user);
            if (!user) {
                throw new Error({ message: 'User doesn\'t exist.', status: 404 });
            }
            return user.deleteOne({ _id: uId })
        })
        .then(success => {
            console.log('User destroyed');
            res.status(200).json({
                message: 'User Deleted'
            })
        })
        .catch(err => {
            res.status(500).json({ message: 'Deleting users failed' });
        })
}

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

exports.grantAdminPermission = (req, res, next) => {
    const id = req.params.id;

    Users.findById({_id : id})
    .then(user=>{
        if(!user){
            res.status(404).json({
                message: 'User not found'
            })
        }
        
        user.role = 'ADMIN';       
        return user.save()
    })
    .then(success=>{
        if(!success){
            res.status(404).json({
                message: 'Error occurred in saving'
            })
        }
        res.status(200).json({
            message: 'Updated admin permission'
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Internal error'
        })
    })
}

exports.revokeAdminPermission = (req, res, next) => {
    const id = req.params.id;

    Users.findById({_id : id})
    .then(user=>{
        if(!user){
            res.status(404).json({
                message: 'User not found'
            })
        }

        user.role = 'USER';        
        return user.save()
    })
    .then(userdoc=>{
        if(!userdoc){
            res.status(404).json({
                message: 'Error occurred in saving'
            })
        }
        const uid = userdoc._id;
        return Books.deleteMany({userId: uid})
    })
    .then((success)=>{
        if(!success){
            res.status(404).json({
                message: 'Error deleting books'
            })
        }
        res.status(200).json({
            message: 'Updated admin permission'
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Internal error'
        })
    })
}
