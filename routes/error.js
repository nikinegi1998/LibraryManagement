// Importing Installed packages
const express = require('express');

const router = express.Router();

// Handles all the invalid endpoints
router.use((req, res, next)=>{
    res.status(404).json({message: 'Page Not Found'})
})

module.exports = router;