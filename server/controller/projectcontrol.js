const {
  insertProject,
  getProjectsByUserId,
  deleteProject
} = require('../model/projectmodel');

const createProject = async (req, res) => {
  const { name, description, userid } = req.body;
  if (!name || !userid) return res.status(400).json({ message: 'Project name and userid are required' });

  try {
    const result = await insertProject(name, description, userid);
    res.status(201).json({ message: result.message, projectid: result.projectid });
  } catch (err) {
    res.status(500).json({ message: 'Database error', err });
  }
};

const getProjectsForUser = async (req, res) => {
  try {
    const results = await getProjectsByUserId(req.params.userid);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', err });
  }
};

const deleteProjectById = async (req, res) => {
  const { projectid } = req.params;
  if (!projectid) return res.status(400).json({ message: 'Project ID is required' });

  try {
    const result = await deleteProject(projectid);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Project not found or already deleted' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', err });
  }
};

module.exports = {
  createProject,
  getProjectsForUser,
  deleteProjectById
};
