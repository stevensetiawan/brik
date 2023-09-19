"use strict"
const router = require('express').Router();
const { validate } = require('express-validation');
const c_user = require('../controllers/c_user');
const passport = require('passport');
const { sendResponse, paginationResponse } = require('../helpers/response');
const { auth, logout, register } = require('../middlewares/passport');
const {
    val_login,
    val_register,
    val_update,
  } = require('../validation/auth.validation');

router.post('/login', validate(val_login), auth);
router.post('/register',validate(val_register), register);

router.use(passport.authenticate('jwt', { session: true }));

router.post('/logout', (req, res) => {
  // remove the JWT token from the cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  res.clearCookie('jwt');

  // send a response
  res.send('Logged out successfully');
});

module.exports = router;