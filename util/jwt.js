// jwt工具库
const jwt = require('jsonwebtoken');
// 密钥
const secretKey = process.env.SECRET_KEY ||'secret';


function generateToken(id,username,is_admin) {
  return jwt.sign({ id: id, username: username,isAdmin:is_admin }, secretKey, { expiresIn: '1d' });
}


function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}


function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.isAdmin) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

function getTokenInfo(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    error.status = 401;
    error.message = 'decode token error';
    throw error;
  }
}

module.exports = { generateToken, verifyToken, verifyAdminToken , getTokenInfo};