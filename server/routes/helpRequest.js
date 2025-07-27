const express = require('express');
const router = express.Router();
const {
  createHelpRequest,
  getAllRequests,
  deleteRequest,
  getMyHelpRequests
} = require('../controllers/helpRequest');
const auth = require('../middleware/auth');

const { offerHelp, respondOffer, getOffersForRequest } = require('../controllers/helpOfferController');

// Create help request
router.post('/request', auth, createHelpRequest);

// View all help requests
router.get('/all', getAllRequests);

// Delete a request (admin only)
router.delete('/:id', deleteRequest);

router.get('/my-requests', auth, getMyHelpRequests);

router.post('/offer', auth, offerHelp);

router.post('/offer/respond', auth, respondOffer);


router.get('/help/:id/offers', auth, getOffersForRequest);
module.exports = router;
