const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/* ------------------ General Authentication Routes ------------------ */

/*
    Google Authentication
*/
router.post('/google', authController.googleAuthentication);

module.exports = router;