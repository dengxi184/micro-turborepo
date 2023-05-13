const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  date: { type: String },
  content: { type: String },
  completed: { type: Boolean },
});

module.exports = mongoose.model('Plan', PlanSchema);
