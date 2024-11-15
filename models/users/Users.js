let mongoose = require("mongoose");

let UsersSchema = new mongoose.Schema({
  _id: String,
  basicInformation: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
  },
  contactInformation: {
    address: { type: String, required: false },
    phoneNumber: { type: String },
  },
});
module.exports = mongoose.model("Users", UsersSchema);
