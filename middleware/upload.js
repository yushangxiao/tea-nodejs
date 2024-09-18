const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../web/images/product/')); // 文件存储路径
    },
    filename: function(req, file, cb) {
        const name = uuidv4().replace(/-/g, '');
        // 获取文件的扩展名
        const extension = file.originalname.split('.').pop();
        // 设置文件名为 id.extension
        cb(null, `${name}.${extension}`);
        req.fileName = `${name}.${extension}`;
    }
});

const uploadMiddleware = multer({ storage: storage,limits: { fileSize: 1024 * 1024 * 10 } });

module.exports = uploadMiddleware;
