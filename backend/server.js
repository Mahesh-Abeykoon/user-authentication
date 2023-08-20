require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "test",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology:true, 
});

// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);

app.listen(port, function (){
    console.log("Server is running on port "+port);
});

