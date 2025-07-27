const express = require('express');
const { getUserLocationByIP } = require('../controllers/getIpLocation');

const router = express.Router();

router.get('/location', getUserLocationByIP);

module.exports = router;
