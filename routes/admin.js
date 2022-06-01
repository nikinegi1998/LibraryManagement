// Importing Installed packages
const express = require('express');

// Importing controllers and middlewares
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isSuper = require('../middleware/is-superadmin');

const router = express.Router();

// Get all the users route (only by super admin)
router.get('/', isAuth, isSuper, adminController.getUsers)

// Get the user by id route (only by super admin)
router.get('/:id', isAuth, isSuper, adminController.getUser)

// Delete or diable any user/ admin route (only by super admin)
router.delete('/delete-user/:id', isAuth, isSuper, adminController.removeUser)

// Grant permission of admin to any user route (only by super admin)
router.patch('/grantAdmin/:id', isAuth, isSuper, adminController.grantAdminPermission)

// Revoke admin permission route (only by super admin)
router.patch('/revokeAdmin/:id', isAuth, isSuper, adminController.revokeAdminPermission)

module.exports = router;
