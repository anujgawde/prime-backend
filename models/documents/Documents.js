let mongoose = require("mongoose");

let DocumentSchema = new mongoose.Schema({
  _id: String,
  data: Object,
  name: String,
  user: { type: String, ref: "Users", required: true },
  templateId: {
    type: String,
    ref: "Templates",
    required: true,
  },
  createAt: Date,
  modifiedAt: Date,
});

module.exports = mongoose.model("Documents", DocumentSchema);
