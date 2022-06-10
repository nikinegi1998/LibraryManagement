module.exports = function isSuper(role){
  return (req, res, next) => {
   
    if(req.role !== role){
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      next(error);
    }
    
    next();
  }
}


