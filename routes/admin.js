const express = require('express');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');
const isSuper = require('../middleware/is-superadmin');

const router = express.Router();

router.get('/', isSuper, adminController.getUsers)

router.get('/:id', isSuper, adminController.getUser)

router.delete('/delete-user/:id', isSuper, adminController.removeUser)

router.patch('/grantAdmin/:id', isSuper, adminController.grantAdminPermission)

router.patch('/revokeAdmin/:id', isSuper, adminController.revokeAdminPermission)

module.exports = router;
