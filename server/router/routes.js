const express = require('express');
const router = express.Router();

const tokencontroller = require('../controller/tokencontrol');
const userControl = require('../controller/usercontrol');
const proControl = require('../controller/projectcontrol');

// Tokens
router.post('/project/add-member',userControl.addProject);
router.get('/members/:id', userControl.getUsersOfProject);
router.get('/member/:id', userControl.getUserById1);
router.get('/tokens/:id', tokencontroller.getTkn);// Get all tokens for a project
router.post('/token',tokencontroller.createTkn);
router.get('/token/subcategories',tokencontroller.getSubcategories);
router.delete('/token/:tid',tokencontroller.DeleteTokens);// Delete a token by ID

// Auth
router.post('/login', userControl.login);
router.post('/register', userControl.register);

// Projects
router.post('/projects', proControl.createProject);
router.get('/user/:userid/projects', proControl.getProjectsForUser);
router.get('/verify', userControl.verifyToken);
router.get('/token/keywords', tokencontroller.getExportKeywords);
router.delete('/project/:projectid', proControl.deleteProjectById);
router.delete('/members/:pid/:uid', userControl.kickMember); // Kick a member from a project


module.exports = router;
