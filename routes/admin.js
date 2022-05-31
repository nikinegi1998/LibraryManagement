const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isSuper = require('../middleware/is-superadmin');

const router = express.Router();

router.get('/', isAuth, isSuper, adminController.getUsers)

router.get('/:id', isAuth, isSuper, adminController.getUser)

router.delete('/delete-user/:id', isAuth, isSuper, adminController.removeUser)

router.patch('/grantAdmin/:id', isAuth, isSuper, adminController.grantAdminPermission)

router.patch('/revokeAdmin/:id', isAuth, isSuper, adminController.revokeAdminPermission)

module.exports = router;
