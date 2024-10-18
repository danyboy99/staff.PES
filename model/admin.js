const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
