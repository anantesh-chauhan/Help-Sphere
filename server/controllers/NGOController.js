const NGO = require('../models/NGO');

const createNGO = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      registrationNumber,
      foundedYear,
      mission,
      type,
      website
    } = req.body;

    const ngo = new NGO({
      name,
      email,
      phone,
      address,
      city,
      registrationNumber,
      foundedYear,
      mission,
      type,
      website
    });

    await ngo.save();
    res.status(201).json({ message: 'NGO created successfully', ngo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating NGO', error });
  }
};


const getAllNgos = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.status(200).json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NGOs" });
  }
};


const deleteNgo = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    res.json({ message: 'NGO deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNGO,
  getAllNgos,
  deleteNgo
};
