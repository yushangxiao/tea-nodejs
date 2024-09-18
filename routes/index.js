const express = require('express');
const router = express.Router();
const usersRouter = require('./user');
const productRouter = require('./product');
const webRouter = require('./web');
const adminRouter = require('./admin');
const {apilimiter,fileLimiter}=require('../middleware/rateLimit');

router.use('/api/admin',apilimiter,adminRouter);
router.use('/api/user',apilimiter, usersRouter);
router.use('/api/product', apilimiter,productRouter);
router.use('/',fileLimiter,webRouter);

module.exports = router;
