const db = require('../config/db');

async function insertProject(name, description, userid) {
  const [result1] = await db.query(
    `INSERT INTO user_project (projectname, description, role, user_id)
     VALUES (?, ?, 'Admin', ?)`, [name, description, userid]
  );

  const projectid = result1.insertId;

  await db.query(
    `INSERT INTO user_v_pro (userid, project_id, role)
     VALUES (?, ?, 'Admin')`, [userid, projectid]
  );

  return { message: 'Project created and user added to user_v_pro', projectid };
}

async function getProjectsByUserId(userid) {
  const [results] = await db.query(`
    SELECT up.projectid, up.projectname, up.description, uvp.role
    FROM user_project up
    INNER JOIN user_v_pro uvp ON up.projectid = uvp.project_id
    WHERE uvp.userid = ?`, [userid]
  );
  return results;
}

async function deleteProject(projectid) {
  await db.query('DELETE FROM user_v_pro WHERE project_id = ?', [projectid]);
  const [result3] = await db.query('DELETE FROM user_project WHERE projectid = ?', [projectid]);
  return result3;
}

module.exports = {
  insertProject,
  getProjectsByUserId,
  deleteProject
};
