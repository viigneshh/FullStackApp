const db = require('../config/db');

// Insert project with user as Admin
const insertProject = (name, description, userid, callback) => {
  const sql1 = `
    INSERT INTO user_project (projectname, description, role, user_id)
    VALUES (?, ?, 'Admin', ?)
  `;

  db.query(sql1, [name, description, userid], (err, result1) => {
    if (err) return callback(err);

    const projectid = result1.insertId;

    const sql2 = `
      INSERT INTO user_v_pro (userid, project_id, role)
      VALUES (?, ?, 'Admin')
    `;

    db.query(sql2, [userid, projectid], (err2, result2) => {
      if (err2) return callback(err2);

      callback(null, {
        message: 'Project created and user added to user_v_pro',
        projectid,
      });
    });
  });
};

// Get all projects for a given user
const getProjectsByUserId = (userid, callback) => {
  const sql = `
    SELECT up.projectid, up.projectname, up.description, uvp.role
    FROM user_project up
    INNER JOIN user_v_pro uvp ON up.projectid = uvp.project_id
    WHERE uvp.userid = ?
  `;
  db.query(sql, [userid], callback);
};

// ✅ Delete a project and its references
const deleteProject = (projectid, callback) => {
  // Step 1: Delete from user_v_pro
  const deleteUserVPro = `DELETE FROM user_v_pro WHERE project_id = ?`;
  db.query(deleteUserVPro, [projectid], (err1) => {
    if (err1) return callback(err1);

 

      // Step 3: Delete the project itself
      const deleteProject = `DELETE FROM user_project WHERE projectid = ?`;
      db.query(deleteProject, [projectid], (err3, result3) => {
        if (err3) return callback(err3);
        callback(null, { message: 'Project deleted successfully' });
      });
    
  });
};

module.exports = {
  insertProject,
  getProjectsByUserId,
  deleteProject,
};
