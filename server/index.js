require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleAuth = require('./middleware/googleAuth');
const errorHandler = require('./middleware/errorHandler');
const db = require('./utils/db');

// Routes
const userRoutes = require('./routes/userRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const helpRoutes = require('./routes/helpRequestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const locationRoutes = require('./routes/locationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bugRoutes = require('./routes/bugRoutes');
const dashboardRoute = require('./routes/dashboardRoutes');
const itemsRoutes = require('./routes/itemRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const http = require('http').createServer(app);

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5050';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
// -----------------------
// Initialize Socket.IO
// -----------------------
const initSocket = require('./socket');
initSocket(http, app);

// -----------------------
// Middleware
// -----------------------
app.use(cors({
  origin: [`${frontendUrl}`, "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// -----------------------
// Google OAuth setup
// -----------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${backendUrl}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: `${frontendUrl}/login`
}), googleAuth, (req, res) => {
  res.redirect(`${frontendUrl}/profile`);
});

// -----------------------
// API Routes
// -----------------------
app.use('/user', userRoutes);
app.use('/ngo', ngoRoutes);
app.use('/donations', donationRoutes);
app.use('/ngos', ngoRoutes);
app.use('/help', helpRoutes);
app.use('/donation', donationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api', locationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bug', bugRoutes);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/items', itemsRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// -----------------------
// Error Handler
// -----------------------
app.use(errorHandler);

// -----------------------
// Connect Database
// -----------------------
db();

// -----------------------
// Start Server
// -----------------------
const PORT = process.env.PORT || 5050;
http.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
