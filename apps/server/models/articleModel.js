const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  content: { type: String },
  date: { type: String },
  type: { type: String },
});

module.exports = mongoose.model('Article', ArticleSchema);
