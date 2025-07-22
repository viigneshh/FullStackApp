const db = require('../config/db');

async function createUser(name, email, hashedpass) {
  const [results] = await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [name, email, hashedpass]
  );
  return results;
}

async function searchUserByMail(email) {
  const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return results;
}

async function getusers(projectid) {
  const [results] = await db.query('SELECT userid FROM user_v_pro WHERE project_id = ?', [projectid]);
  return results;
}

async function getUserbyId(userid) {
  const [results] = await db.query('SELECT * FROM users WHERE user_id = ?', [userid]);
  return results;
}

async function addUserToProject(userid, projectid, role) {
  const [results] = await db.query(
    'INSERT INTO user_v_pro (userid, project_id, role) VALUES (?, ?, ?)',
    [userid, projectid, role]
  );
  return results;
}

async function removeUserFromProject(userid, projectid) {
  const [result] = await db.query('DELETE FROM user_v_pro WHERE userid = ? AND project_id = ?', [userid, projectid]);
  if (result.affectedRows === 0) {
    return { message: 'No user found in project or already removed' };
  }
  return { message: 'User removed from project successfully' };
}

module.exports = {
  createUser,
  searchUserByMail,
  getusers,
  getUserbyId,
  addUserToProject,
  removeUserFromProject
};
