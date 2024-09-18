const express = require('express');
const router=express.Router();
const fileMiddleware=require('../middleware/file');

router.use(fileMiddleware,express.static('web', {
    extensions: ['html']
}));

module.exports=router;




