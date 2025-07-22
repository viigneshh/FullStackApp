const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

// Optional: Replace with your actual DB query to find or create user
const db = require('./db'); // Assuming you have a db module to handle database operations

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = profile.displayName;

    // Check if user exists in DB
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (rows.length === 0) {
      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, 'google_oauth'] // Set dummy password or handle logic differently
      );
      user = { userid: result.insertId, username, email };
    } else {
      user = rows[0];
    }

    // Generate JWT token
    const token = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return done(null, { ...user, token });
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
