const express   = require('express');
const Sequelize = require('sequelize');
const db        = require('../db');
const router    = express.Router();
const Op        = Sequelize.Op;

/* GET loans list page */
router.get('/', function(req, res) {
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

/* GET loans create page */
router.get('/create', findBooks, findPatrons, getDates, function(req, res) {
  res.render('loans/create',
    {
      loan: db.loan.build(),
      books: req.books,
      patrons: req.patrons,
      loanDate: req.today,
      dueDate: req.nextWeek,
      title: 'New Loan'
    });
});

router.post('/', function(req, res) {
  console.log(req.body);
  db.loan.create(req.body).then((loan) => {
    res.redirect('/loans');
  }).catch(function(error) {
    if (error.name === "SequelizeValidationError") {
      res.render('loans/create', {
        book: db.loan.build(req.body),
        title: 'New Loan',
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

function findBooks(req, res, next) {
  db.book.findAll().then(function(books) {
    req.books = books;
    return next();
  }).catch(function(error) {
    res.sendStatus(500);
  });
}

function findPatrons(req, res, next) {
  db.patron.findAll().then(function(patrons) {
    req.patrons = patrons;
    return next();
  }).catch(function(error) {
    res.sendStatus(500);
  });
}

function getDates(req, res, next) {
  const now = new Date();
  let month = now.getUTCMonth() + 1;
  let day = now.getUTCDate();
  let year = now.getUTCFullYear();
  req.today = year + "-" + month + "-" + day;

  now.setDate(now.getDate() + 7);

  month = now.getUTCMonth() + 1;
  day = now.getUTCDate();
  year = now.getUTCFullYear();
  req.nextWeek = year + "-" + month + "-" + day;

  next();
}

module.exports = router;