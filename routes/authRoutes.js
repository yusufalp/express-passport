const express = require('express');
const passport = require('passport');

const router = express.Router();

// local strategy for login
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login/local', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login/local/failed'
}));

router.get('/login/local/failed', (req, res, next) => {
  res.json({ message: 'Username or password is incorrect.' });
});

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});

// local strategy for signup
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const salt = crypto.randomBytes(16);
  const { firstName, lastName, username, password, strategy } = req.body;
  // encrypt the password and create a new User object with the hashed password
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (error, hashedPassword) => {
    if (error) {
      return next(error);
    }
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      salt,
      strategy
    });

    await newUser.save();

    req.login(newUser, (error) => {
      if (error) {
        return next(error);
      }
      res.redirect('/');
    });
  });
});

// // github strategy
// router.get('/login/github', passport.authenticate('github'));
// router.get('/login/github/failed', (req, res, next) => {
//   res.json({ message: 'There is a problem with GitHub authentication.' });
// });
// router.get('/auth/github', passport.authenticate('github', {
//   successRedirect: '/',
//   failureRedirect: '/login/github/failed'
// }));

// // google strategy
// router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));
// router.get('/login/google/failed', (req, res, next) => {
//   res.json({ message: 'There is a problem with Google authentication.' });
// });
// router.get('/auth/google', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login/google/failed'
// }));

module.exports = router;

