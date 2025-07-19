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
function addUserToProject(userid, projectid, role, callback) {
    db.query(
        'INSERT INTO user_v_pro (userid, project_id, role) VALUES (?, ?, ?)',
        [userid, projectid, role],
        (err, results) => {
            if (err) {
                console.log(`Couldn't add user to project due to: ${err}`);
                return callback(err, null);
            }
            return callback(null, results);
        }
    );
}
// Remove a user from a project
const removeUserFromProject = (userid, projectid, callback) => {
  const sql = `DELETE FROM user_v_pro WHERE userid = ? AND project_id = ?`;

  db.query(sql, [userid, projectid], (err, result) => {
    if (err) return callback(err);

    if (result.affectedRows === 0) {
      return callback(null, { message: 'No user found in project or already removed' });
    }

    callback(null, { message: 'User removed from project successfully' });
  });
};


// Export both functions
module.exports = {
    createUser,
    searchUserByMail,
    getusers,
    getUserbyId,
    addUserToProject,
    removeUserFromProject
};
