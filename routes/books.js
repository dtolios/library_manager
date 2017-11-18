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

  if (req.query.filter === 'overdue') {
    title = 'Overdue Books';
    whereObj = [
      {
        return_by: {
          [Op.lt]: new Date()
        }
      },
      {
        returned_on: null
      }
    ];
  }
  if (req.query.filter === 'checked_out') {
    title = 'Checked Out Books';
    whereObj = {
      returned_on: null
    };
  }

  db.book.findAll({
    include: [{
      model: db.loan,
      where: whereObj
    }]
  })
  .then(books => {
    res.render('books', { books: books, title: title });
  })
  .catch(error => {
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
    })
  .then(book => {
    if(book) {
      res.render('books/detail', {book: book, loans: book.Loans, title: book.title});
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

/**
 * PUT /books/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', function(req, res) {
  db.book.findById(req.params.id)
  .then(book => {
    if (book) {
      return book.update(req.body);
    } else {
      res.sendStatus(404);
    }
  })
  .then(book => {
    res.redirect('/books');
  })
  .catch(error => {
    console.log(error);
    if (error.name === 'SequelizeValidationError') {
      const book = db.book.build(req.body);
      book.id = req.params.id;
      res.render('books/detail', {
        book: book,
        title: book.title,
        errors: error.errors
      })
    }
  });
});

module.exports = router;