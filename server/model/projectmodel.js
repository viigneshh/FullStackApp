const db = require('../config/db');

// Insert project with user as Admin
const insertProject = (name, description, userid, callback) => {
  const sql = `
    INSERT INTO user_project (projectname, description, role, user_id)
    VALUES (?, ?, 'Admin', ?)
  `;
  db.query(sql, [name, description, userid], callback);
};

// Get all projects for a given user
const getProjectsByUserId = (userid, callback) => {
  const sql = `SELECT projectid, projectname, description FROM user_project WHERE user_id = ?`;
  db.query(sql, [userid], callback);
};

module.exports = {
  insertProject,
  getProjectsByUserId,
};
