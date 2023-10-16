const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const validator = require('validator');

// router.post('/register', async function (req, res) {
//   const { username, password } = req.body;

//   if (!validator.isEmail(username)) {
//     return res.status(400).json({ message: 'Invalid email' });
//   }

//   try {
//     // Register the user using passport-local-mongoose
//     const user = new User({ username });
//     await user.setPassword(password);
//     await user.save();

//     // Authenticate the user
//     passport.authenticate('local')(req, res, function () {
//       res.status(200).json({ message: 'Registration successful' });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: `Registration failed: ${error.message}` });
//   }
// });

// router.post('/register', function (req, res) {
//   const { username, password } = req.body;

//   if (!validator.isEmail(username)) {
//     return res.status(400).json({ message: 'Invalid email' });
//   }

//   User.register({ username }, password, function (err, user) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: 'Registration failed' });
//     } else {
//       passport.authenticate('local')(req, res, function () {
//         res.status(200).json({ message: 'Registration successful' });
//       });
//     }
//   });
// });

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
router.post('/login', passport.authenticate('local'), function (req, res) {
  // Successful login
  res.json({ message: 'Login successful' });
});


router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  // Validate email format using validator
  if (!validator.isEmail(username)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Ensure the user object has a valid password property
    if (!user.password) {
      return res.status(400).json({ message: 'User password is missing' });
    }

    // Compare passwords using bcrypt
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Successful login
    req.login(user, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Login failed' });
      } else {
        return res.json({ message: 'Login successful' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   const user = req.user;

//   if (!user) {
//     res.status(401).json({ message: 'Authentication failed' });
//   } else {
//     res.status(200).json({ message: 'Authentication successful', user });
//   }
// });


// router.get('/logout', function (req, res) {
//   req.logout(function (err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: 'Logout Failed' });
//     } else {
//       res.json({ message: 'Logout Successfully' });
//     }
//   });
// });

module.exports = router;
