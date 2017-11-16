const express   = require('express');
const Sequelize = require('sequelize');
const db        = require('../db');
const router    = express.Router();
const Op        = Sequelize.Op;

/* GET loans list page */
router.get('/', function(req, res, next) {
  let title = 'Loans';
  let whereObject = null;

  if (req.query.overdue) {
    title = 'Overdue Loans';
    whereObject = [{
      return_by: {[Op.lt]: new Date()}
    }, {
      returned_on: null
    }];
  }
  else if (req.query.checkedOut) {
    title = 'Checked Out Books';
    whereObject = {
      returned_on: null
    };
  }
  else {
    whereObject = null;
    title = 'Loans';
  }
  db.loan.findAll({
    where: whereObject,
    include: [{
      model: db.book
    }, {
      model: db.patron
    }]
  }).then(function(loans) {
    res.render('loans', { loans: loans, title: title });
  });
});

module.exports = router;