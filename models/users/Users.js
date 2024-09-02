let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UsersSchema = new mongoose.Schema({
  _id: String,
  basicInformation: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  contactInformation: {
    address: { type: String, required: false },
    phoneNumber: { type: String },
  },
  rolePermissions: {
    role: { type: String, required: false },
    permissions: [{ type: String }],
  },
  employmentDetails: {
    employeeId: { type: String, required: false, unique: true },
    department: { type: String, required: false },
    managerId: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  },
});
module.exports = mongoose.model("Users", UsersSchema);
