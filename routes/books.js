const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* GET all books page */
router.get('/', function(req, res, next) {
    Book.findAll().then(function(books) {
        res.render('books', { books: books, title: 'Books' });
    });
});

module.exports = router;
