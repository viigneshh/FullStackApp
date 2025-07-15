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
function getusers(projectid, callback) {
    db.query( 'select userid from user_v_pro where project_id=?',[projectid],(err, results) => {
        if (err) {
            console.log(`Couldn't get users due to: ${err}`);
            return callback(err, null);
        }
        return callback(null, results);
});}
function getUserbyId(userid, callback) {
    db.query(
        'SELECT * FROM users WHERE user_id = ?',
        [userid],
        (err, results) => {
            if (err) {
                console.log(`Couldn't get user by ID due to: ${err}`);
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
    getusers,
    getUserbyId
};
