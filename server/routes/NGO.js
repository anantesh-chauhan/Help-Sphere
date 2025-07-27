const express = require('express');
const router = express.Router();
const { createNGO, getAllNgos, deleteNgo } = require('../controllers/NGOController');

router.post('/add-ngo', createNGO);

router.get('/view-ngos', getAllNgos);

router.delete('/delete-ngo/:id', deleteNgo);

module.exports = router;
