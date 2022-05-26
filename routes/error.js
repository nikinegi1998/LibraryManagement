const express = require('express');

const router = express.Router();

router.get('/error', (req, res, next)=>{
    res.status(404).json({message: 'Page Not Found'})
})

module.exports = router;