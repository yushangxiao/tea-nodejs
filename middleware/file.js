const {verifyToken,getTokenInfo} = require('../util/jwt');

function fileMiddleware(req,res,next){
    if (req.path=="/"){
        res.redirect("/index");
        return;
    }
    const path=req.path;
    const passPath=["/login","/signup"]
    if(passPath.includes(path) || path.startsWith("/images") || path.startsWith("/layer") ){
        next();
        if (path == "/images/back.jpg"){
            // 配置缓存
            res.set('Cache-Control', 'public, max-age=86400'); // 缓存一天
        }
        return;
    }
    try {
        const token = req.cookies.token;
        if (!token ||!verifyToken(token)) {
          // return res.status(401).json({ success: false, error: '用户未登录或登录过期' });
          // 重定向到登录页面
          res.redirect('/login');
          return;
        }
        req.user = getTokenInfo(token);
      } catch (error) {
        res.redirect('/login');
        return;
      }
    if (path.startsWith("/admin") &&!req.user.isAdmin){
      // res.send({success:false,path:path,data:req.user})
        res.redirect("/");
        return;
    }
    if (!path.includes(".")){
        req.path=path+".html";
    }

    next();
    
}
module.exports=fileMiddleware;