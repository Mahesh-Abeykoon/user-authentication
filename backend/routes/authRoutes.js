const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    const user = req.user; // The authenticated user
  
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
    } else {
      res.status(200).json({ message: 'Authentication successful', user });
    }
  });
  

module.exports = router;