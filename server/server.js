require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport'); // Load strategy config
const routes = require('./router/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // <-- Mount passport

// Routes
app.use('/api', routes);
app.use('/auth', routes); // include Google login route here

app.listen(process.env.PORT || 5000, () => console.log("Server running on port 5000"));
