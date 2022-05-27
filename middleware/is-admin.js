module.exports = (req, res, next)=>{
    const user = req.session.user
    if(user.role !== 'ADMIN'){
        return res.status(403).json({message: 'Not authorized admin'})
    }
    next();
}