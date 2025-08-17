const User = require('../models/User');
const Request = require('../models/helpRequest');
const ItemsDonated = require('../models/Item');
const Review = require('../models/Review');
const HelpOffer = require('../models/HelpOffer');

// Controller for user-specific dashboard stats
const getUserDashboardStats = async (req, res) => {
  try {

    console.log("Fetching user dashboard stats...");
    // Assuming you have user ID in req.user.id after authentication middleware
    const userId = req.user._id;

    const [myRequests, myDonations, myReviews, myHelpOffers] = await Promise.all([
      Request.countDocuments({ user: userId }),
      ItemsDonated.countDocuments({ donatedBy: userId }),
      Review.countDocuments({ user: userId }),
      HelpOffer.countDocuments({ user: userId }),
    ]);

    console.log("Result:", { myRequests, myDonations, myReviews, myHelpOffers });
    res.status(200).json({
      success: true,
      stats: {
        myRequests,
        myDonations,
        myReviews,
        myHelpOffers,
      },
    });
  } catch (err) {
    console.error('User Dashboard Stats Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getUserDashboardStats };
