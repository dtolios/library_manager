/* eslint-disable comma-dangle,prefer-destructuring */
const winston = require('winston');
const Sequelize = require('sequelize');
const db = require('../db');

const Op = Sequelize.Op;

exports.bookList = (req, res) => {
  let title = 'Books';
  let whereObj = null;
  delete req.session.updateBookErrors;

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
};

exports.bookCreateGet = (req, res) => {
  res.render('books/create', { book: db.book.build(), title: 'New Book' });
};

exports.bookDetailGet = (req, res) => {
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
        res.render('books/detail', {
          book, loans: book.Loans, title: book.title, errors: req.session.updateBookErrors
        });
      } else {
        res.sendStatus(404);
      }
    });
};

exports.bookCreatePost = (req, res) => {
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
};

exports.bookDetailPut = (req, res) => {
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
        req.session.updateBookErrors = error.errors;
        res.redirect(`/books/${req.params.id}`);
      }
    });
};
