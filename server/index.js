require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleAuth = require('./middleware/googleAuth');
const errorHandler = require('./middleware/errorHandler');
const db = require('./utils/db');

const userRoutes = require('./routes/user');
const ngoRoutes = require('./routes/NGO');
const helpRoutes = require('./routes/helpRequest');
const donationRoutes = require('./routes/donation');
const weatherRoutes = require('./routes/weather');
const locationRoutes = require('./routes/location');
const reviewRoutes = require('./routes/Review');
const bugRoutes = require('./routes/bugRoutes');
const dashboardRoute = require('./routes/dashboard');
const itemsRoutes = require('./routes/item');

const upload = require('./middleware/multer');
const cloudinary = require('./utils/cloudinary');
const Image = require('./models/image');


const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');


const app = express();

//  Create HTTP server from Express app
const http = require('http').createServer(app);

//  Setup Socket.IO with CORS
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  }
});

//  Setup socket event handlers
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, message, sender }) => {
    io.to(roomId).emit('message', {
      message,
      sender,
      createdAt: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

//  Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
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

//  Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5050/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

//  Google Auth Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account'
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173/login'
}), googleAuth, (req, res) => {
  res.redirect('http://localhost:5173/profile');
});

//  Image upload route
app.use('/uploads', express.static(path.join(__dirname, '../public', 'uploads')));

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const file = req.file.path;
  const cloudinaryResponse = await cloudinary.uploader.upload(file, {
    folder: "Images-Upload-Test"
  });

  const newImage = await Image.create({
    title: cloudinaryResponse.original_filename,
    url: cloudinaryResponse.secure_url
  });

  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    filePath: `/uploads/${req.file.filename}`,
    url: cloudinaryResponse.secure_url
  });
});

// Register all routes
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
// app.use('/api/messages', messageRoutes);

//  Error handler
app.use(errorHandler);

//  Connect DB
db();

//  Start server using HTTP server, not app.listen!
const PORT = process.env.PORT || 5050;
http.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
