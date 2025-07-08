const express = require('express');
const cors = require('cors');
const routes = require('./router/routes');
const app = express();

app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/api', routes);      // includes /projects, /user/:userid/projects, /tokens/:id
app.use('/auth', routes);     // for /login and /register

app.listen(5000, () => console.log("Server running on port 5000"));
