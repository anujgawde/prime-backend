const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");

// Define routes
router.get("/signin", authController.signin);
router.post("/signup", authController.signup);

module.exports = router;
