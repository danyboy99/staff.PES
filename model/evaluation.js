const mongoose = require("mongoose");
const { Schema } = mongoose;
const evaluationSchema = new Schema({
  critaria: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  week: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  evaluator: {
    type: String,
    required: true,
  },
  staff: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: false,
  },
});

const evaluation = mongoose.model("performance", evaluationSchema);

module.exports = evaluation;
