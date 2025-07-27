const HelpRequest = require('../models/helpRequest');
const HelpOffer = require('../models/HelpOffer');

// Create new request

const createHelpRequest = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    const {
      title,
      description,
      message,
      category,
      location,
      neededBy,
      priority,
    } = req.body;

    // Minimal validation
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, Description, and Category are required' });
    }

    const helpRequest = new HelpRequest({
      title,
      description,
      message,
      category,
      location,
      neededBy,
      priority,
      user: req.user._id,  // 🔗 Linked to logged-in user
    });
    console.log("helpRequest : ", helpRequest);
    console.log("User  : ", req.user);
    await helpRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Help request submitted successfully',
      helpRequest,
    });

  } catch (error) {
    console.error('[HelpRequest Error]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};


// Delete request by ID
const deleteRequest = async (req, res) => {
  try {
    await HelpRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request' });
  }
};

const getMyHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // lean() to allow adding custom fields like 'offers'

    // For each request, fetch its offers and attach them
    const populatedRequests = await Promise.all(requests.map(async (reqDoc) => {
      const offers = await HelpOffer.find({ helpRequest: reqDoc._id })
        .populate('helper', 'name email phone')
        .sort({ createdAt: -1 });

      return {
        ...reqDoc,
        offers: offers.map(o => ({
          _id: o._id,
          message: o.message,
          status: o.status,
          user: o.helper,  // Rename `helper` as `user` to match frontend expectations
        }))
      };
    }));

    res.json({ success: true, requests: populatedRequests });
  } catch (err) {
    console.error('Failed to fetch user requests:', err);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
};



module.exports ={
    createHelpRequest,
    getAllRequests,
    deleteRequest,
    getMyHelpRequests
}