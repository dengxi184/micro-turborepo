const rimraf = require('rimraf');

const Article = require('../models/articleModel');

exports.articlePublish = [
  async (req, res) => {
    try {
      //const { id, title, content, date, type } = req.body
      await Article.create({ ...req.body });
      res.send({ msg: '发布成功！' });
    } catch (err) {
      res.status(422).send({ msg: '发布失败！' });
    }
  },
];

exports.getArticle = [
  async (req, res) => {
    try {
      const { type, id, curPage, pageSize } = req.body;
      const skipCount = (+curPage - 1) * +pageSize;
      const list = await Article.find({ type, id })
        .sort({ creatAt: -1 }) // 按创建时降序
        .skip(skipCount) // 跳过的条数
        .limit(+pageSize); //查询几条
      const total = await Article.find({ type, id }).count();
      const finalList = list.map((article) => {
        return { title: article.title, id: article._id };
      });
      res.send({ listData: finalList, total });
    } catch (err) {
      res.status(422).send({ msg: '列表获取失败！', err });
    }
  },
];

exports.getArticleDetails = [
  async (req, res) => {
    try {
      const { id } = req.body;
      const { title, content } = await Article.findOne({ id });
      res.send({ title, content });
    } catch (err) {
      res.status(422).send({ msg: '文章详情失败！', err });
    }
  },
];
