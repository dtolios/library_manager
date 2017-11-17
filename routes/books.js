const express    = require('express');
const db         = require('../db');
const Sequelize  = require('sequelize');
const router     = express.Router();
const Op         = Sequelize.Op;

/**
 * GET /books
 * Renders the list of books page
 * If the filter parameter is set, will filter results
 */
router.get('/', function(req, res) {
  let title = 'Books';
  let whereObj = null;
  const include = [];

  if (req.query.filter === 'overdue') {
    title = 'Overdue Books';
    whereObj = [{return_by: {[Op.lt]: new Date()}}, {returned_on: null}];
    include.push(
      {
        model: db.loan,
        where: [{
          return_by: {[Op.lt]: new Date()}
          },
          {
            returned_on: null
          }]
      }
    );
  }
  else if (req.query.filter === 'checked_out') {
    title = 'Checked Out Books';
    include.push(
      {
        model: db.loan,
        where: {
          returned_on: null
        }
      }
    );
  }
  else {
    include.push(
      {
        model: db.loan
      }
    );
  }

  db.book.findAll({include: include}).then(function(books) {
    res.render('books', { books: books, title: title });
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

/**
 * GET /books/create
 * Renders the book creation page
 */
router.get('/create', function(req, res) {
  res.render('books/create', {book: db.book.build(), title: 'New Book'})
});

/**
 * GET /books/:id
 * Renders the book detail page, which includes the update form
 */
router.get('/:id', function(req, res) {
  db.book.findById(req.params.id,
    {
      include: [{
        model: db.loan,
        include: [{
          model: db.book
        },{
          model: db.patron
        }]
      }]
    }).then(function(book) {
    if(book) {
      res.render('books/show', {book: book, loans: book.Loans, title: book.title});
    } else {
      res.sendStatus(404);
    }
  });
});

/**
 * POST /books
 * Handler for creating a new book resource
 */
router.post('/', function(req, res, next) {
  db.book.create(req.body).then((book) => {
    res.redirect('/books');
  }).catch(function(error) {
    if (error.name === "SequelizeValidationError") {
      res.render('books/create', {
        book: db.book.build(req.body),
        title: 'New Book',
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

module.exports = router;