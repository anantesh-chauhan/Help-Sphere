const express = require('express');
const { getUserLocationByIP } = require('../controllers/getIpLocation');

const router = express.Router();

router.get('/', getUserLocationByIP);

module.exports = router;
