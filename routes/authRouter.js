const express = require('express');
const { login, signup, loginRedirect, signupRedirect } = require('../controllers/authController');

const router = express.Router();

router.get('/login', login);
router.get('/signup', signup);
router.get('/login/redirect', loginRedirect);
router.get('/signup/redirect', signupRedirect);

module.exports = router;
