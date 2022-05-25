const {Router} = require('express');

const router = Router();

router.get('/error', (req, res, next)=>{
    res.status(404).json({message: 'Page Not Found'})
})