const express = require('express');
const { login, signup, loginRedirect, signupRedirect, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.get('/login', login);
router.get('/signup', signup);
router.get('/login/redirect', loginRedirect);
router.get('/signup/redirect', signupRedirect);
router.post('/google-login', googleLogin);

module.exports = router;
