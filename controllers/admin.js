const Users = require('../models/user');
const Books = require('../models/book');

exports.getUsers = (req, res, next) => {

    Users.find()
        .then(usersList => {
            if (!usersList) {
                const error = new Error('Failed to get all the users');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Users List',
                books: usersList
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getUser = (req, res, next) => {
    const uId = req.params.id;

    Users.findById(uId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'User Found',
                users: user
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.removeUser = (req, res, next) => {
    const uId = req.params.id;

    Users.findById(uId)
        .then(user => {
            console.log(user);
            if (!user) {
                const error = new Error('User does not exist');
                error.statusCode = 404;
                throw error;
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
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.grantAdminPermission = (req, res, next) => {
    const id = req.params.id;

    Users.findById({ _id: id })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            user.role = 'ADMIN';
            return user.save()
        })
        .then(success => {
            res.status(200).json({
                message: 'Updated admin permission'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.revokeAdminPermission = (req, res, next) => {
    const id = req.params.id;

    Users.findById({ _id: id })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            user.role = 'USER';
            return user.save()
        })
        .then(userdoc => {
            if (!userdoc) {
                const error = new Error('Failed to update the role');
                error.statusCode = 422;
                throw error;
            }
            const uid = userdoc._id;
            return Books.deleteMany({ userId: uid })
        })
        .then((success) => {
            if (!success) {
                const error = new Error('Error deleting books');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({
                message: 'Updated admin permission'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
