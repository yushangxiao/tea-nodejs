const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const userMiddleware = require('../middleware/user');


router.get("/allProduct",userMiddleware,async(req,res)=>{
    try {
        const products=await Product.find({})
        products.sort((a, b) => {
            return b.isOnSale - a.isOnSale; // 这里利用了JavaScript的true为1，false为0的特性
          });
        res.status(200).send({success:true,data:products});
    } catch (err) {
        res.status(500).send({success:false,error:err});
    }
})

// router.post("/addProduct",async(req,res)=>{
//     try{
//         const newProduct=new Product({
//             productName:req.body.productName,
//             productPrice:req.body.productPrice
//         })
//         await newProduct.save();
//         res.status(200).send({success:true,data:newProduct});
//     }catch(err){
//         res.status(500).send({success:false,error:err});
//     }
// })

module.exports = router;