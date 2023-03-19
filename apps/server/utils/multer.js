//封装上传图片

//引进multer模块  记得在终端安装multer模块
const multer = require('multer');
const path = require('path');

//3、对上传的文件进行配置
var storage = multer.diskStorage({
  //指定文件上传到服务器的路径
  destination: function (req, file, cb) {
    cb(null, 'static/images'); //上传目录
  },

  //指定上传到服务器文件的名称
  filename: function (req, file, cb) {
    const createAt = Date.now();
    const name = createAt + path.extname(file.originalname);
    req.fileRename = name;
    req.imgName = file.originalname;
    req.createAt = createAt;
    cb(null, name);
  },
});
const upload = multer({ storage });

//导出模块
module.exports = upload;
