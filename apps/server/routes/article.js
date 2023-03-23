const express = require('express');
const ArticleController = require('../controllers/ArticleController');

const router = express.Router();

router.post(`/publish`, ArticleController.articlePublish);
router.get(`/fetch-article-list`, ArticleController.getArticle);
router.get(`/details`, ArticleController.articleDetails);
router.delete('/delete', ArticleController.articleDelete);

module.exports = router;
