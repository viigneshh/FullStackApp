const db = require('../config/db');

// Function to create a user
function createUser(name, email, hashedpass, callback) {
    db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [name, email, hashedpass],
        (err, results) => {
            if (err) {
                console.log(`Couldn't insert due to: ${err}`);
                return callback(err, null);
            }
            return callback(null, results);
        }
    );
}

// Function to search for a user by email
function searchUserByMail(email, callback) {
    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.log(`Couldn't search due to: ${err}`);
                return callback(err, null);
            }
            return callback(null, results);
        }
    );
}

// Export both functions
module.exports = {
    createUser,
    searchUserByMail,
};
