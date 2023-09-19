"use strict"
const router = require('express').Router();
const c_category = require('../controllers/c_category');
const passport = require('passport');

router.use(passport.authenticate('jwt', {session: true}))
router.get('/', c_category.getAllCategory)

module.exports = router;