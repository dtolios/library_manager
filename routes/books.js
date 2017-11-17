const express    = require('express');
const db         = require('../db');
const Sequelize  = require('sequelize');
const router     = express.Router();
const Op         = Sequelize.Op;

/* GET books list page */
router.get('/', function(req, res, next) {
  let title = 'Books';
  const include = [];

  if (req.query.overdue) {
    title = 'Overdue Books';
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
  else if (req.query.checkedOut) {
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

router.get('/create', function(req, res, next) {
  res.render('books/create', {book: db.book.build(), title: 'New Book'})
});

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