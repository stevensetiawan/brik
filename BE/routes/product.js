"use strict"
const router = require('express').Router();
const { validate } = require('express-validation');
const c_product = require('../controllers/c_product');
const passport = require('passport');
const {
    validate_create_product,
    validate_update_product,
  } = require('../validation/product.validation');

const uploader= require('../middlewares/uploadMiddleware');

router.get('/', c_product.getProducts)
router.get('/:id', c_product.getDetailProduct)
router.use(passport.authenticate('jwt', {session: true}))
router.post('/', uploader.single('image'), validate(validate_create_product), c_product.create_product)
router.put('/:id', uploader.single('image'),  c_product.updateProduct)
router.delete('/:id', c_product.deleteProduct)

module.exports = router;