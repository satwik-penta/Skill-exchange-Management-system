const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../db');

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Registering Google OAuth strategy');
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // Check if user exists
      db.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) {
          return done(null, results[0]);
        } else {
          // Create new user
          const id = Date.now();
          const fullName = profile.displayName;
          const firstName = profile.name.givenName || '';
          const lastName = profile.name.familyName || '';
          const email = profile.emails[0].value;
          const profilePicture = profile.photos[0].value;
          db.query('INSERT INTO users (id, firstName, lastName, fullName, email, profilePicture, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, firstName, lastName, fullName, email, profilePicture, true], (err) => {
            if (err) return done(err);
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
              if (err) return done(err);
              return done(null, results[0]);
            });
          });
        }
      });
    }
  ));
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && 
    process.env.GITHUB_CLIENT_ID !== 'your-github-client-id' && 
    process.env.GITHUB_CLIENT_SECRET !== 'your-github-client-secret') {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // Check if user exists
      db.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) {
          return done(null, results[0]);
        } else {
          // Create new user
          const id = Date.now();
          const fullName = profile.displayName || profile.username;
          const firstName = profile.name ? profile.name.split(' ')[0] : '';
          const lastName = profile.name ? profile.name.split(' ').slice(1).join(' ') : '';
          const email = profile.emails[0].value;
          const profilePicture = profile.photos[0].value;
          db.query('INSERT INTO users (id, firstName, lastName, fullName, email, profilePicture, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, firstName, lastName, fullName, email, profilePicture, true], (err) => {
            if (err) return done(err);
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
              if (err) return done(err);
              return done(null, results[0]);
            });
          });
        }
      });
    }
  ));
}

module.exports = passport;