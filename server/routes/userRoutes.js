const express = require('express');
const router = express.Router();

const register = require('../controllers/register');
const login = require('../controllers/login');
const auth = require('../middleware/auth');
const getUser = require('../controllers/getUser');
const logout = require('../controllers/logout');
const { getUserDashboardStats } = require('../controllers/userDashboardController');

router.post('/register', register);

router.post('/login', login);

router.get('/logout', auth, logout);

router.get('/profile' , auth , getUser);

router.get('/stats', auth, getUserDashboardStats);

module.exports = router;