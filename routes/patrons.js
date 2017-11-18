const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * GET /patrons
 * Renders the patron list page
 */
router.get('/', (req, res) => {
  db.patron.findAll().then((patrons) => {
    res.render('patrons', { patrons, title: 'Patrons' });
  });
});

/**
 * GET /patrons/create
 * Renders the patron creation page
 */
router.get('/create', (req, res) => {
  res.render('patrons/create', { patrons: db.patron.build(), title: 'New Patron' });
});

/**
 * GET /patrons/:id
 * Renders the patron detail page, which includes the update form
 */
router.get('/:id', (req, res) => {
  db.patron.findById(
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
  ).then((patron) => {
    if (patron) {
      res.render('patrons/detail', { patron, loans: patron.Loans, title: `${patron.first_name} ${patron.last_name}` });
    } else {
      res.sendStatus(404);
    }
  });
});

/**
 * POST /patrons
 * Handler for creating a new patron resource
 */
router.post('/', (req, res) => {
  db.patron.create(req.body).then(() => {
    res.redirect('/patrons');
  }).catch((error) => {
    if (error.name === 'SequelizeValidationError') {
      res.render('patrons/create', {
        patron: db.patron.build(req.body),
        title: 'New Patron',
        errors: error.errors,
      });
    } else {
      throw error;
    }
  }).catch(() => {
    res.sendStatus(500);
  });
});

/**
 * PUT /patrons/:id
 * Handler for updating an existing patron resource
 */
router.put('/:id', (req, res) => {
  db.patron.findById(
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
    .then((patron) => {
      if (!patron) {
        res.sendStatus(404);
      }
      return patron.update(req.body);
    })
    .then(() => {
      res.redirect('/patrons');
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        const patron = db.patron.build(req.body);
        patron.id = req.params.id;
        res.render(
          'patrons/detail',
          {
            patron,
            loans: patron.Loans,
            title: `${patron.first_name} ${patron.last_name}`,
          }
        );
      }
    });
});

module.exports = router;
