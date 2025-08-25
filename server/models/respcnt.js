const mongoose = require("mongoose");

const respcntSchema = new mongoose.Schema({
  Form_No: Number,  // or String, depending on your DB
  // add other fields here
});

module.exports = mongoose.model("respcnt", respcntSchema, "RCCS10");
