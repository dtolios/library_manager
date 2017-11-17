const express   = require('express');
const db        = require('../db');
const router    = express.Router();

/* GET patrons list page */
router.get('/', function(req, res, next) {
  db.patron.findAll().then(function(patrons) {
    res.render('patrons', { patrons: patrons, title: 'Patrons' });
  });
});

/**
 * GET /patrons/:id
 * Renders the patron detail page, which includes the update form
 */
router.get('/:id', function(req, res) {
  db.patron.findById(req.params.id,
    {
      include: [{
        model: db.loan,
        include: [{
          model: db.book
        },{
          model: db.patron
        }]
      }]
    }).then(function(patron) {
    if(patron) {
      res.render('patrons/detail', {patron: patron, loans: patron.Loans, title: patron.first_name + " " + patron.last_name});
    } else {
      res.sendStatus(404);
    }
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
router.post('/', function(req, res) {
  db.patron.create(req.body).then((patron) => {
    res.redirect('/patrons');
  }).catch(function(error) {
    if (error.name === "SequelizeValidationError") {
      res.render('patrons/create', {
        patron: db.patron.build(req.body),
        title: 'New Patron',
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