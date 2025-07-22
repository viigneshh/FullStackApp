const express = require('express');
require('dotenv').config();
const cors = require('cors');
const routes = require('./router/routes');
const passport = require('./config/passport');
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
// Mount all routes
app.use('/api', routes);      // includes /projects, /user/:userid/projects, /tokens/:id
app.use('/auth', routes);     // for /login and /register

app.listen(5000, () => console.log("Server running on port 5000"));
