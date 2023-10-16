const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(User.createStrategy()); //simplifies process of handling username and password-based authentication.

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/secrets',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    )
  );
};
