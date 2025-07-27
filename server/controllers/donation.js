const Donation = require('../models/Donation');

// Add donation
const addDonation = async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    await newDonation.save();
    res.status(201).json({ message: "Donation submitted successfully", donation: newDonation });
  } catch (err) {
    console.error('Add Donation Error:', err);
    res.status(500).json({ error: 'Failed to submit donation' });
  }
};

// Get all donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Get Donations Error:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// Delete a donation
const deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Delete Donation Error:', err);
    res.status(500).json({ error: 'Failed to delete donation' });
  }
};

module.exports ={
    addDonation,
    getAllDonations,
    deleteDonation
}
