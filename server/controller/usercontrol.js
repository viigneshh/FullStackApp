const {
  createUser,
  searchUserByMail,
  getusers,
  getUserbyId,
  addUserToProject,
  removeUserFromProject
} = require('../model/usermodel');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await searchUserByMail(email);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedpass = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedpass);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await searchUserByMail(email);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      userid: user.user_id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: "Unexpected error", err });
  }
};

const verifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    return res.status(200).json({ message: 'Token is valid', user: decoded });
  });
};

const getUsersOfProject = async (req, res) => {
  try {
    const results = await getusers(req.params.id);
    if (results.length === 0) return res.status(404).json({ message: 'No users found for this project' });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const getUserById1 = async (req, res) => {
  try {
    const results = await getUserbyId(req.params.id);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const addProject = async (req, res) => {
  try {
    const { userid, projectid, role } = req.body;
    const results = await addUserToProject(userid, projectid, role);
    res.status(201).json({ message: 'User added to project successfully', data: results });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const kickMember = async (req, res) => {
  try {
    const { pid, uid } = req.params;
    const result = await removeUserFromProject(uid, pid);
    if (result.message === 'No user found in project or already removed') {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  getUsersOfProject,
  getUserById1,
  addProject,
  kickMember
};
