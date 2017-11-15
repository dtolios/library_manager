const express = require('express');
const router = express.Router();
const Loan = require('../models').Loan;

/* GET loans list page */
router.get('/', function(req, res, next) {
  Loan.findAll().then(function(loans) {
    res.render('loans', { loans: loans, title: 'Loans' });
  });
});

module.exports = router;