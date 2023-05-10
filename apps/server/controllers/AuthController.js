const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const decrypt = require('../crypt/decrypt');
// 应该放在代码不被上传和扫描的部分
const { SECRET } = require('../crypt/secret');

// 鉴权中间件
const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop();
  const { id } = jwt.verify(raw, SECRET);
  req.user = await User.findById(id); //这里需要添加一些错误处理，不执行next
  next();
};

// 用户注册 sanitizeBody用于包裹从客户端传来的数据需要进行清理的key
exports.register = [
  body('account')
    .notEmpty()
    .withMessage('用户名不能为空！')
    .custom(async (account) => {
      const user = await User.findOne({ account });
      if (user) return Promise.reject('用户名已存在');
    }),
  body('password').notEmpty().withMessage('密码不能为空！'),
  body('account').escape(),
  body('password').escape(),
  // 可在这添加中间件鉴权之类的
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        console.log(errors);
        return res.send('注册失败！');
      }
      await User.create({
        account: `${req.body.account}`,
        password: `${req.body.password}`,
        pwd: `123456`,
      });
      res.send('注册成功！');
    } catch (err) {
      console.log(err);
    }
  },
];

exports.login = [
  body('account').notEmpty().withMessage('用户名不能为空！'),
  body('password').notEmpty().withMessage('密码不能为空！'),
  body('account').escape(),
  body('password').escape(),
  async (req, res) => {
    try {
      const user = await User.findOne({
        account: req.body.account,
      });
      if (!user) {
        return res.status(422).send({
          message: '用户名不存在！',
        }); //客户端提交数据有问题
      }
      const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(422).send({
          message: '密码无效',
        });
      }
      //生成token
      const token = jwt.sign(
        {
          id: String(user._id), //密码不要放进来，放一个唯一的东西就可以了
        },
        SECRET,
      );
      res.send({
        id: user._id,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },
];

exports.validate = [
  body('pwd').notEmpty().withMessage('密码不能为空！'),
  body('id').escape(),
  body('pwd').escape(),
  async (req, res) => {
    try {
      const { id, pwd } = req.body;
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(422).send({
          message: '用户名不存在！',
        }); //客户端提交数据有问题
      }
      const isPasswordValid = user.pwd === decrypt(pwd);
      if (!isPasswordValid) {
        return res.status(422).send({
          message: '密码无效',
        });
      }
      res.send({
        msg: '校验成功！',
      });
    } catch (err) {
      console.log(err);
    }
  },
];
