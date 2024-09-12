const Users = require("../../models/users/Users");

exports.signin = async (req, res) => {};

exports.signup = async (req, res) => {
  if (!req.body) {
    return;
  }

  const user = new Users(req.body);
  const result = await user.save();
  res.json(result);
};
