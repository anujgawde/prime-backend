const express = require("express");
const router = express.Router();
const documentController = require("../../controllers/document/documentController");

// Define routes
router.get("/", documentController.getAllDocuments);

router.post("/delete", documentController.deleteDocument);

router.post("/recent", documentController.getRecentDocuments);

router.post("/aggregate", documentController.getAggregateDocuments);

module.exports = router;
