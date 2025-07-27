const User = require('../models/User');
const Request = require('../models/helpRequest');
const ItemsDonated = require('../models/Item');
const Review = require('../models/Review');
const NGO = require('../models/NGO');
const BugReport = require('../models/BugReport');
const HelpOffer = require('../models/HelpOffer');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalRequests, totalDonations, totalReviews, activeNGOs, bugReports , helpOffers] =
      await Promise.all([
        User.countDocuments(),
        Request.countDocuments(),
        ItemsDonated.countDocuments(),
        Review.countDocuments(),
        NGO.countDocuments({ isActive: true }),
        BugReport.countDocuments(),
        HelpOffer.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRequests,
        totalDonations,
        totalReviews,
        activeNGOs,
        bugReports,
        helpOffers,
      },
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };
