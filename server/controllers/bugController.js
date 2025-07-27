const BugReport = require("../models/BugReport");

const createBugReport = async (req, res) => {
  try {
    const { description, stepsToReproduce, severity } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bug = await BugReport.create({
      user: req.user._id,
      description,
      stepsToReproduce,
      severity,
    });
    console.log("Bug : " , bug);
    res.status(201).json({ success: true, bug });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const reports = await BugReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBugReport,
  getUserReports,
};
