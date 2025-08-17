const express = require('express');
const { addDonation, getAllDonations, deleteDonation } = require('../controllers/donation');
const router = express.Router();


router.post('/donate', addDonation);
router.get('/view', getAllDonations);
router.delete('/delete/:id', deleteDonation);

module.exports = router;
