const express = require('express');
const router = express.Router();
const passport = require('../config/passport');


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


router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Step 2: Handle Google callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173/login',
  session: false,
}), (req, res) => {
  const token = req.user.token;
  const username = req.user.username;
  const userid = req.user.userid;

  // Redirect to frontend with query parameters (register/login success)
  res.redirect(`http://localhost:5173/auth/google/callback?token=${token}&username=${username}&userid=${userid}`);
});

module.exports = router;
