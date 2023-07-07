const express = require('express');
const Book = require('../models/bookModel');

const router = express.Router();

router.get('/admin', (req, res, next) => {
  if (req.isAuthenticated()) {
    Book.find({}).then(books => {
      res.render('admin', {
        books: books
      });
    });
  } else {
    res.redirect('/login/local/failed');
  }
});

router.get('/create', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('create');
  } else {
    res.redirect('/login');
  }
});

router.post('/create', async (req, res, next) => {
  const { title, author, publisher, genre, pages, rating, synopsis } = req.body;
  const newBook = new Book({
    title,
    author,
    publisher,
    genre,
    pages,
    rating,
    synopsis
  });
  await newBook.save();

  res.redirect('/admin');
});

router.get('/edit/:id', (req, res, next) => {
  const { id } = req.params;
  if (req.isAuthenticated()) {
    Book.findById(id).then(foundBook => {
      console.log(foundBook);
      res.render('edit', {
        book: foundBook
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, author, publisher, genre, pages, rating, synopsis } = req.body;

  await Book.findByIdAndUpdate(id, {
    $set: {
      title,
      author,
      publisher,
      genre,
      pages,
      rating,
      synopsis
    }
  }, { new: true });

  res.redirect('/admin');
});

router.get('/delete/:id', async (req, res, next) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  res.redirect('/admin');
});

module.exports = router;