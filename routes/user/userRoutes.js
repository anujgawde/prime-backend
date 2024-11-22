const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");

// Define routes
router.get(`/:id`, userController.fetchUserDetails);
router.post(
  `/document-template-aggregate`,
  userController.fetchUserDocsAggregate
);
router.post(`/update-user-profile`, userController.updateUserProfile);

module.exports = router;
