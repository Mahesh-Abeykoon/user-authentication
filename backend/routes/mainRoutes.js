const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const validator = require('validator');

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to the homepage' });
});



// Handle requests for registration page
router.get('/register', function (req, res) {
  res.json({ message: 'Please register' });
});

// Handle requests for secrets page
router.get('/secrets', function (req, res) {
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome to the secrets page' });
  } else {
    res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
});

// // Handle registration request
// router.post('/register', function (req, res) {
//   User.register({ username: req.body.username }, req.body.password, function (
//     err,
//     user
//   ) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: 'Registration failed' });
//     } else {
//       res.json({ message: 'Registration successful' });
//     }
//   });
// });

// Handle registration request
router.post('/register', function (req, res) {
  const { username, password } = req.body;

  if (!validator.isEmail(username)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  User.register({ username }, password, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Registration failed' });
    } else {
      passport.authenticate('local')(req, res, function () {
        res.status(200).json({ message: 'Registration successful' });
      });
    }
  });
});

router.post('/', function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Login failed' });
    } else {
      res.json({ message: 'Login successful' });
    }
  });
});

router.get("/logout", function (req, res){
  req.logout(function(err){
    if(err) {
      console.log(err);
      res.status(500).json({ message: "Logout Failed" });
    } else {
      res.json({ message: "Logout Successfully" });
    }
  });
});


module.exports = router;