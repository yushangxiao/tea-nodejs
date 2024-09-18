const {verifyToken,getTokenInfo,verifyAdminToken} = require('../util/jwt');
function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token ||!verifyAdminToken(token)) {
      // return res.status(401).json({ success: false, error: '非管理员无法访问' });
      // 重定向到登录页面
      res.cookie('token', null, {
        maxAge: -1,
      });
      res.redirect('/login');
      return;
    }
    req.user = getTokenInfo(token);
  } catch (error) {
    res.cookie('token', null, {
      maxAge: -1,
    });
    return res.status(401).json({ success: false, error: '用户未登录' });
  }
  next();
}
module.exports=adminMiddleware;