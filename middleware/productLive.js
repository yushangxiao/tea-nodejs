const Product=require('../models/Product');

async function productLiveMiddleware(req,res,next){
    const product=await Product.findOne({productName:req.body.productName});
    if(product){
        res.send({success:false,error:"商品已存在"});
        return;
    }
    next();
}
module.exports=productLiveMiddleware;