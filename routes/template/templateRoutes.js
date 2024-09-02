const express = require("express");
const router = express.Router();
const templateController = require("../../controllers/template/templateController");

router.get("/", templateController.getAllTemplates);

router.post("/delete", templateController.deleteTemplate);

router.post("/most-used", templateController.getTopTemplates);

module.exports = router;
