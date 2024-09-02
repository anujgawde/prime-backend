let mongoose = require("mongoose");

let TemplateSchema = new mongoose.Schema({
  _id: String,
  data: Object,
  name: String,
  user: { type: String, ref: "Users", required: false },
  createAt: Date,
  modifiedAt: Date,
});

module.exports = mongoose.model("Templates", TemplateSchema);
