const express = require('express');
const router = express.Router();

const { 
  login, 
  signup, 
  loginRedirect, 
  signupRedirect, 
  googleLogin 
} = require('../controllers/authController');

router.get('/login', login);
router.get('/signup', signup);
router.get('/login/redirect', loginRedirect);
router.get('/signup/redirect', signupRedirect);
router.post('/google-login', googleLogin);

module.exports = router;
