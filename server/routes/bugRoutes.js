const express = require("express");
const auth = require("../middleware/auth");
const { createBugReport, getUserReports } = require("../controllers/bugController");
const router = express.Router();

router.post("/report-bug", auth, createBugReport);
router.get("/my-reports", auth, getUserReports);

module.exports = router;
