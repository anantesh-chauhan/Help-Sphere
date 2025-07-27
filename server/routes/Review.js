const express = require('express');
const { createReview, getMyReviews, updateReview, deleteReview, getAllReviews } = require('../controllers/Review');
const auth = require('../middleware/auth');
const router = express.Router();



router.post('/', auth, createReview);
router.get('/my', auth, getMyReviews);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);
router.get('/all', getAllReviews);

module.exports = router;
