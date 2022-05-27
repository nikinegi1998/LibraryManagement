const Users = require('../models/user');
const Books = require('../models/book');

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
