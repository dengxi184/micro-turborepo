const mongoose = require('mongoose');

const ImgSchema = new mongoose.Schema({
  fileName: { type: String },
  imgName: { type: String },
  createAt: { type: Number },
  url: { type: String },
  size: { type: String },
  scale: { type: Number },
});

module.exports = mongoose.model('Img', ImgSchema);
