const express = require('express');
const winston = require('winston');
const Sequelize = require('sequelize');
const db = require('../db');


const router = express.Router();
const Op = Sequelize.Op;

/**
 * GET /books
 * Renders the list of books page
 * If the filter parameter is set, will filter results
 */
router.get('/', (req, res) => {
  let title = 'Books';
  let whereObj = null;

  if (req.query.filter === 'overdue') {
    title = 'Overdue Books';
    whereObj = [
      {
        return_by: {
          [Op.lt]: new Date(),
        },
      },
      {
        returned_on: null,
      },
    ];
  }
  if (req.query.filter === 'checked_out') {
    title = 'Checked Out Books';
    whereObj = {
      returned_on: null,
    };
  }

  db.book.findAll({
    include: [{
      model: db.loan,
      where: whereObj,
    }],
  })
    .then((books) => {
      res.render('books', { books, title });
    })
    .catch((error) => {
      winston.log('error', error);
      res.sendStatus(500);
    });
});

/**
 * GET /books/create
 * Renders the book creation page
 */
router.get('/create', (req, res) => {
  res.render('books/create', { book: db.book.build(), title: 'New Book' });
});

/**
 * GET /books/:id
 * Renders the book detail page, which includes the update form
 */
router.get('/:id', (req, res) => {
  db.book.findById(
    req.params.id,
    {
      include: [{
        model: db.loan,
        include: [{
          model: db.book,
        }, {
          model: db.patron,
        }],
      }],
    }
  )
    .then((book) => {
      if (book) {
        res.render('books/detail', { book, loans: book.Loans, title: book.title });
      } else {
        res.sendStatus(404);
      }
    });
});

/**
 * POST /books
 * Handler for creating a new book resource
 */
router.post('/', (req, res) => {
  db.book.create(req.body)
    .then(() => {
      res.redirect('/books');
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        res.render('books/create', {
          book: db.book.build(req.body),
          title: 'New Book',
          errors: error.errors,
        });
      } else {
        throw error;
      }
    })
    .catch((error) => {
      winston.log('error', error);
      res.sendStatus(500);
    });
});

/**
 * PUT /books/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', (req, res) => {
  db.book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        res.sendStatus(404);
      }
      return book.update(req.body);
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((error) => {
      winston.log('error', error);
      if (error.name === 'SequelizeValidationError') {
        const book = db.book.build(req.body);
        book.id = req.params.id;
        res.render('books/detail', {
          book,
          title: book.title,
          errors: error.errors,
        });
      }
    });
});

module.exports = router;
