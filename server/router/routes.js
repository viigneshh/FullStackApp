const express = require('express');
const router = express.Router();

const tokencontroller = require('../controller/tokencontrol');
const userControl = require('../controller/usercontrol');
const proControl = require('../controller/projectcontrol');

// Tokens
router.get('/tokens/:id', tokencontroller.getTkn);

// Auth
router.post('/login', userControl.login);
router.post('/register', userControl.register);

// Projects
router.post('/projects', proControl.createProject);
router.get('/user/:userid/projects', proControl.getProjectsForUser);
router.get('/verify', userControl.verifyToken);


module.exports = router;
