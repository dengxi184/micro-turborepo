const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: { type: String },
  fileHash: { type: String },
  status: { type: Number },
  key: { type: Number },
  size: { type: String },
});

module.exports = mongoose.model('File', FileSchema);
