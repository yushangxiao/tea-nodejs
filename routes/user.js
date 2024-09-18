const express = require('express');
const router = express.Router();
const User = require('../models/User');
const md5 = require('md5');
const userMiddleware = require('../middleware/user');
const{login_signup_limiter}=require('../middleware/rateLimit');
const {generateToken}=require('../util/jwt');
const adminSerct=process.env.ADMIN_SECRET || "admin";
const email=process.env.MY_EMAIL || "goodLuck@you.day";

// 创建新用户
router.post('/signup',login_signup_limiter,async (req, res) => {
    isAdmin=false;
    if (req.body.adminSerct){ 
        if(req.body.adminSerct != adminSerct ){
        res.send({suuess:false,error:"adminSerct error"})
        return;
        }
        isAdmin=true;
    }
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.status(400).send({success:false,error:"用户名已存在"});
      return;
    }
    const newUser = new User({
      username: req.body.username,
      adminSerct: req.body.adminSerct,
      password: md5(req.body.password),
      isAdmin:isAdmin
    });
  
    try {
      const user = await newUser.save();
      res.status(201).send({success:true,error:"注册成功"});
    } catch (err) {
      res.status(500).send({success:false,error:"注册失败,"+err});
    }
  });

// 用户登录
router.post('/login',login_signup_limiter ,async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(401).send({success:false,error:"用户名不存在"});
        return;
      }
      if (user.password!== md5(req.body.password)) {
        res.status(401).send({success:false,error:"密码错误"});
        return;
      }
      const token = generateToken(user._id,user.username,user.isAdmin);
      res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.send({success:true,token:token});
    } catch (err) {
      res.status(500).send({success:false,error:"登录失败,"+err});
    }
  });

router.get('/email',userMiddleware, async (req, res) => {
    try {
      res.status(200).send({success:true,email:email})
    } catch (err) {
      res.send({success:false,error:"获取邮箱失败,"+err});
    }
  });


router.get('/info',userMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.send({success:true,username:user.username,is_admin:user.isAdmin})
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.get('/logout',userMiddleware,(req, res) => {
    res.cookie('token', null, {
      maxAge: -1,
    });
    res.send({success:true})
  });
module.exports = router;
