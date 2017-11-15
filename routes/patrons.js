const express = require('express');
const router = express.Router();
const Loan = require('../models').Patron;

/* GET patrons list page */
router.get('/', function(req, res, next) {
  Loan.findAll().then(function(patrons) {
    res.render('patrons', { patrons: patrons, title: 'Patrons' });
  });
});

module.exports = router;