const Users = require('../models/user');

exports.getUsers = (req, res, next)=>{
    Users.find()
    .then(usersList=>{
        res.status(200).json({
            message: 'Users List',
            books: usersList
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Fetching users failed' });
    })    
}

exports.getUser = (req, res, next)=>{
    const uId = req.params.id;

    Users.findById(uId)
    .then(user=>{
        if(!user){
            throw new Error({message: 'User not found.', status: 404});
        }
        res.status(200).json({
            message: 'User Found',
            users: user
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Book id not found' });
    })    
}

exports.postAddUser =(req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const user = new Users({
        name : name,
        email : email,
        password : password,
        role : role
    })

    user.save()
    .then(success=>{
        res.status(200).json({
            message: 'User created',
            users : user
        })
    })
    .catch(err=>{
        console.log(err.message)
        res.status(500).json({ message: 'Saving user failed' });
    })    
}

exports.postUpdateUser = (req, res, next)=>{
    const uId = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    Users.findById(uId)
    .then(user=>{
        if(!user){
            throw new Error({message: 'User doesn\'t exist.', status: 404});
        }
        user.name = name,
        user.email = email,
        user.password = password,
        user.role = role
        return user.save()
    })
    .then(success=>{
        console.log('User Updated');
        return res.status(200).json({
            message: 'User details Updated'
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Updating users failed' });
    })    
}

exports.removeUser = (req, res, next)=>{
    const uId = req.params.id;

    Users.findById(uId)
    .then(user=>{
        console.log(user);
        if(!user){
            throw new Error({message: 'User doesn\'t exist.', status: 404});
        }
        return user.deleteOne({_id: uId})
    })
    .then(success=>{
        console.log('User destroyed');
        res.status(200).json({
            message: 'User Deleted'
        })
    })
    .catch(err=>{
        res.status(500).json({ message: 'Deleting users failed' });
    })    
}

exports.getAllFavList = (req, res, next) =>{
    const user = req.user;
    console.log(user);

    if(!user){
        throw new Error('user not logged in');
    }
    Users.findById({_id: user._id})
    .then(usr=>{
        console.log(usr);

        if(!usr){
            throw new Error('user not found');
        }   
                
        const favList = usr.favourites;

        console.log(favList);
        if(!favList){
            return res.status(200).json({
                message: 'No books added'
            })
        }

        return res.status(200).json({
            message: 'All favorites book fetched',
            favorites : favList
        })
    })
    .catch(err=>{
        console.log(err.message);
    })
}