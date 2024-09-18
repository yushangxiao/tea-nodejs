const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const adminMiddleware = require('../middleware/admin');
const uploadMiddleware = require('../middleware/upload');
const productLiveMiddleware = require('../middleware/productLive');
const fs = require('fs');
const path = require('path');

const rootSecret=process.env.ROOT_SECRET || "root";

router.use(adminMiddleware);

// 获取所有用户
router.get('/alluser', async (req, res) => {
    try {
      const users = await User.find({});
      users.forEach(user => user.password="");
      users.sort((a,b)=>{
        return b.isAdmin - a.isAdmin;
      })
      res.status(200).send({success:true,data:users});
    } catch (err) {
      res.status(500).send({success:false,error:err});
    }
  });

  // 删除所有，debug
// router.get('/deleteall', async (req, res) => {
//     try {
//       await User.deleteMany({});
//       res.send({success:true,msg:"删除成功"});
      
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   });

router.get("/deleteuser/:id",async(req,res)=>{
    try {
        
        const user=await User.findOne({_id:req.params.id})
        if (!user){
            res.status(400).send({success:false,error:"用户不存在"});
            return;
        }
        if (req.user.username == user.username){
            res.status(400).send({success:false,error:"无法删除自己"});
            return;
        }

        if (user.isAdmin){
            if(req.query.rootSecret && rootSecret==req.query.rootSecret){
                await User.deleteOne({_id:req.params.id})
                res.status(200).send({success:true,data:"删除成功"});
                return;
            }
            res.status(400).send({success:false,error:"管理员密钥错误"});
            return;
        }
        await User.deleteOne({_id:req.params.id})
        res.status(200).send({success:true,data:"删除成功"});
    } catch (err) {
        res.status(500).send({success:false,error:err});
    }
})

router.post('/upload',uploadMiddleware.single("file"),async(req,res)=>{
    res.send({success:true,fileName:req.fileName});
    return;
})
    


router.post('/newProduct',productLiveMiddleware,async(req,res)=>{
    try {
        const product=req.body;
        if (!product.fileName || !product.productName ||!product.productPrice){
            res.status(400).send({success:false,error:"参数错误"});
            return;
        }
        product.imageName=product.fileName;
        delete product.fileName;
        const newProduct=new Product(product);
        await newProduct.save();
        res.status(200).send({success:true,data:"添加成功"});
    }
    catch (err) {
        res.status(500).send({success:false,error:err});
    }
})

router.get('/deleteproduct/:id',async(req,res)=>{
    try {
        const product=await Product.findOne({_id:req.params.id})
        if (!product){
            res.status(400).send({success:false,error:"商品不存在"});
            return;
        }
        // 删除图片
        try{
            fs.unlinkSync(path.join(__dirname, '../web/images/product/',product.imageName));
        }catch(err){
            console.log("原始图片丢失");
        }
        await Product.deleteOne({_id:req.params.id})
        res.status(200).send({success:true,data:"删除成功"});
    } catch (err) {
        res.status(500).send({success:false,error:err});
    }
})

router.get('/changeSale/:id',async(req,res)=>{
    try {
        const product=await Product.findOne({_id:req.params.id})
        if (!product){
            res.status(400).send({success:false,error:"商品不存在"});
            return;
        }
        product.isOnSale=!product.isOnSale;
        await product.save();
        res.status(200).send({success:true,data:"修改成功"});
    } catch (err) {
        res.status(500).send({success:false,error:err});
    }
})

router.get('/clearImage',async(req,res)=>{
    try {
        const products=await Product.find({});
        //获取路径下所有文件
        const fileList=fs.readdirSync(path.join(__dirname, '../web/images/product/'));
        const fileNameList=products.map(product=>product.imageName);
        let delFileConutt=0;
        //获取文件列表中不存在的文件
        //遍历文件列表，删除文件
        fileList.forEach(fileName=>{
          if (!fileNameList.includes(fileName) && fileName!="1.txt"){
            fs.unlinkSync(path.join(__dirname, '../web/images/product/',fileName));
            delFileConutt++;
          }
        })
        res.status(200).send({success:true,data:{delFileConutt:delFileConutt}});
    } catch (err) {
        res.status(500).send({success:false,error:err});
    }
})


module.exports = router;