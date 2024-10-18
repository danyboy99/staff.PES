const mongoose = require("mongoose");

const { Schema } = mongoose;

const staffSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const staff = mongoose.model("staff", staffSchema);

module.exports = staff;
