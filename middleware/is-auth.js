module.exports = (req, res, next)=>{
    if(!req.session.isLoggedIn){
        return res.status(401).json({message: 'User not logged in'})
    }
    next();
}
