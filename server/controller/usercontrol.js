const { createUser, searchUserByMail,getusers } = require('../model/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        searchUserByMail(email, async (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (result.length > 0) {
                return res.status(409).json({ message: "Email already registered" });
            }

            const hashedpass = await bcrypt.hash(password, 10);

            createUser(name, email, hashedpass, (err, results) => {
                if (err) return res.status(500).json({ message: "User creation failed" });

                res.status(201).json({ message: "User registered successfully" });
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Unexpected error", error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    searchUserByMail(email, async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

                res.status(200).json({
            message: 'Login successful',
            token, 
            userid: user.user_id,      // ✅ send this to frontend
            username: user.username    // optional, for UI
            });

        console.log(`${token}`)
    });
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
const getUsersOfProject = (req, res) => {
    const projectId = req.params.id;
    getusers(projectId,(err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) { res.status(404).json({ message: 'No users found for this project' }); }
        else { res.status(200).json(results); }
    }); }



module.exports = {
    register,
    login,
    verifyToken,
    getUsersOfProject,
};
