require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend files
app.use(express.static(__dirname));

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Auth routes
app.get('/auth/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
        process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
      return res.status(500).json({ 
        error: 'Google OAuth not configured', 
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
        setup_instructions: 'Visit https://console.cloud.google.com/ to create OAuth credentials'
      });
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
        process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
      return res.status(500).json({ 
        error: 'Google OAuth not configured', 
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
        setup_instructions: 'Visit https://console.cloud.google.com/ to create OAuth credentials'
      });
    }
    next();
  },
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard.html');
  });

app.get('/auth/github',
  (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || 
        process.env.GITHUB_CLIENT_ID === 'your-github-client-id') {
      return res.status(500).json({ 
        error: 'GitHub OAuth not configured', 
        message: 'Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.',
        setup_instructions: 'Visit https://github.com/settings/developers to create OAuth App'
      });
    }
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || 
        process.env.GITHUB_CLIENT_ID === 'your-github-client-id') {
      return res.status(500).json({ 
        error: 'GitHub OAuth not configured', 
        message: 'Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.',
        setup_instructions: 'Visit https://github.com/settings/developers to create OAuth App'
      });
    }
    next();
  },
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard.html');
  });

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Multer error handling
app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error: " + err.message
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message
    });
  }

  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Peer Skill Exchange API Running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});