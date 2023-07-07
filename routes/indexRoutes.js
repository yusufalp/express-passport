const express = require('express');
const Book = require('../models/bookModel');

const router = express.Router();

// these variables are used in multiple pages. We can send them by adding them to 'res.locals' like so.
// instead of sending separately, we can make use of 'use' method so it is included in every method below it.
// we must call next() at the end so that it continues to other paths below it.
router.use((req, res, next) => {
  // console.log("auth", req.isAuthenticated());
  // console.log("user", req.user);
  const username = req.isAuthenticated() ? req.user.username : "";
  res.locals.username = username;
  res.locals.isUserLoggedIn = req.isAuthenticated();
  next();
});

router.get('/', (req, res, next) => {
  Book.find({}).then(books => {
    res.render('index', {
      books: books,
    });
  });
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

router.post('/search', (req, res, next) => {
  const { userSearchTerm } = req.body;
  Book.find({}).then(books => {
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(userSearchTerm.toLowerCase()));
    res.render('index', {
      books: filteredBooks,
    });
  });
});

router.get('/books/:id', (req, res, next) => {
  const { id } = req.params;
  Book.findOne({ _id: id }).then(foundBook => {
    res.render('book', {
      book: foundBook,
    });
  });
});

module.exports = router;