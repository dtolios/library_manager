const express   = require('express');
const db        = require('../db');
const router    = express.Router();

/* GET patrons list page */
router.get('/', function(req, res, next) {
  db.patron.findAll().then(function(patrons) {
    res.render('patrons', { patrons: patrons, title: 'Patrons' });
  });
});

/* GET patrons create page */
router.get('/create', function(req, res) {
  res.render('patrons/create', {patrons: db.patron.build(), title: 'New Patron'});
});

/**
 * POST /patrons
 * Handler for creating a new patron resource
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