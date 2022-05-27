module.exports = (req, res, next)=>{
    const user = req.session.user
    if(user.role !== 'SUPER ADMIN'){
        return res.status(403).json({message: 'Not authorized super admin'})
    }
    next();
}