const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/* ------------------ General Authentication Routes ------------------ */

/*
    Google Authentication
*/
router.post('/google', authController.googleAuthentication);

/*
    Check Google Authentication
*/
router.get('/check-auth', authController.checkAuthentication);

/*
    Logout
*/
router.post('/logout', authController.logoutAuthentication);

module.exports = router;