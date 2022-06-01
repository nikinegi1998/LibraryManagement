// Importing database models
const Users = require('../models/user');
const Books = require('../models/book');

// Fetch all the users
exports.getUsers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemsPerPage = 3;

    try {
        // total no. of users count
        const totalusers = await Users.find().countDocuments()
                
        const usersList = await Users.find()
        .skip((currentPage-1)*itemsPerPage)
        .limit(itemsPerPage)

        if (!usersList) {
            const error = new Error('Failed to get all the users');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Users List',
            books: usersList,
            totalusers: totalusers
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Fetch the details of the user
exports.getUser = async (req, res, next) => {
    const uId = req.params.id;

    try {
        const user = await Users.findById(uId)

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'User Found',
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

// Deletes the user
exports.removeUser = async (req, res, next) => {
    const uId = req.params.id;

    try {
        const user = await Users.findById(uId)

        console.log(user);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            throw error;
        }
        await user.deleteOne({ _id: uId })

        // Delete all the books with userId as uId
        Books.deleteMany({userId: uId});

        console.log('User destroyed');
        res.status(200).json({
            message: 'User Deleted'
        })
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Grants admin permission to user
exports.grantAdminPermission = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await Users.findById({ _id: id })

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.role = 'ADMIN';
        await user.save()

        res.status(200).json({
            message: 'Updated admin permission'
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// Revoke admin permission from existing admin
exports.revokeAdminPermission = async (req, res, next) => {
    const id = req.params.id;

    try {

        const user = await Users.findById({ _id: id })

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.role = 'USER';
        await user.save()

        // const allBook = await Books.find({userId: user._id})
        // console.log(allBook)
        
        const uid = user._id;
        await Books.deleteMany({ userId: uid })

        res.status(200).json({
            message: 'Updated admin permission'
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
