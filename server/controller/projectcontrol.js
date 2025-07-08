const { insertProject, getProjectsByUserId } = require('../model/projectmodel');

// POST /api/projects
const createProject = (req, res) => {
  const { name, description, userid } = req.body;

  if (!name || !userid) {
    return res.status(400).json({ message: 'Project name and userid are required' });
  }

  insertProject(name, description, userid, (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(201).json({
      message: 'Project created',
      projectid: result.insertId,
    });
  });
};

// GET /api/user/:userid/projects
const getProjectsForUser = (req, res) => {
  const userid = req.params.userid;

  getProjectsByUserId(userid, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Error fetching projects" });
    }
    return res.status(200).json(results);
  });
};

module.exports = {
  createProject,
  getProjectsForUser,
};
