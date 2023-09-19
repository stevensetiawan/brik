"use strict"
const router = require('express').Router()
const passport = require('passport')
const user = require('./user')
const product = require('./product')
const category = require('./category')

router.use('/user', user)
router.use('/product', product)
router.use('/category', category)

module.exports = router



