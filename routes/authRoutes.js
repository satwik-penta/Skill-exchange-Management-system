const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');

// Email transporter (should be moved to a config file)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email verification route
router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  db.query('SELECT * FROM users WHERE verificationToken = ?', [token], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    const user = results[0];
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    db.query('UPDATE users SET isVerified = true, verificationToken = NULL WHERE id = ?', [user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      res.redirect('/verify-success.html');
    });
  });
});

// Resend verification email
router.post('/resend-verification', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    db.query('UPDATE users SET verificationToken = ? WHERE id = ?', [verificationToken, user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - Peer Skill Exchange',
        html: `
          <h2>Welcome to Peer Skill Exchange!</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>If the link doesn't work, copy and paste this URL: ${verificationUrl}</p>
        `
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Email sending error:', error);
          return res.status(500).json({ message: 'Failed to send verification email' });
        }
        res.json({ message: 'Verification email sent successfully' });
      });
    });
  });
});

module.exports = router;