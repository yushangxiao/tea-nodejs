const {verifyToken,getTokenInfo} = require('../util/jwt');
// 用户认证中间件
async function userMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token ||!verifyToken(token)) {
      // return res.status(401).json({ success: false, error: '用户未登录或登录过期' });
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

module.exports = userMiddleware;