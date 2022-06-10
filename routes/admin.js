// Importing Installed packages
const express = require('express');

// Importing controllers and middlewares
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isSuper = require('../middleware/is-superadmin');
const Roles = require('../data');

const router = express.Router();

// Get all the users route (only by super admin)
router.get('/', isAuth, isSuper(Roles.SUPERADMIN), adminController.getUsers)

// Get the user by id route (only by super admin)
router.get('/:id', isAuth, isSuper(Roles.SUPERADMIN), adminController.getUser)

// Delete or diable any user/ admin route (only by super admin)
router.delete('/delete-user/:id', isAuth, isSuper(Roles.SUPERADMIN), adminController.removeUser)

// Grant permission of admin to any user route (only by super admin)
router.patch('/grantAdmin/:id', isAuth, isSuper(Roles.SUPERADMIN), adminController.grantAdminPermission)

// Revoke admin permission route (only by super admin)
router.patch('/revokeAdmin/:id', isAuth, isSuper(Roles.SUPERADMIN), adminController.revokeAdminPermission)

module.exports = router;
