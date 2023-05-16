const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  date: { type: String },
  description: { type: String },
  completed: { type: Boolean },
  id: { type: String },
});

module.exports = mongoose.model('Plan', PlanSchema);
