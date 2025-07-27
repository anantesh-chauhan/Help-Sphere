const HelpOffer = require('../models/HelpOffer');
const HelpRequest = require('../models/helpRequest');

async function offerHelp(req, res) {
  if (!req.user) return res.status(401).json({ msg: 'Login required' });

  const { helpRequestId, message } = req.body;

  const existing = await HelpOffer.findOne({ helpRequest:helpRequestId, helper:req.user._id });
  if (existing) return res.status(400).json({ msg: 'Already offered' });

  const offer = new HelpOffer({ helpRequest:helpRequestId, helper:req.user._id, message });
  await offer.save();

  res.json({ msg:'Offer submitted', offer });
}

async function respondOffer(req, res) {
  const { offerId, response } = req.body; // response = accepted/rejected
  const offer = await HelpOffer.findById(offerId).populate('helpRequest');
  if (!offer) return res.status(404).json({ msg:'Not found' });

  if (offer.helpRequest.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg:'Not authorized' });
  }

  offer.status = response;
  await offer.save();

  res.json({ msg:`Offer ${response}`, offer });
}

async function getOffersForRequest(req,res){
  const offers = await HelpOffer.find({ helpRequest:req.params.id })
    .populate('helper','name email phone')
    .sort('-createdAt');
  res.json(offers);
}

module.exports = { offerHelp, respondOffer, getOffersForRequest };
