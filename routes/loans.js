const express = require('express');
const winston = require('winston');
const Sequelize = require('sequelize');
const db = require('../db');

const router = express.Router();
const Op = Sequelize.Op;

/**
 * GET /loans
 * Renders the list of loans page
 * If the filter parameter is set, will filter results
 */
router.get('/', (req, res) => {
  let title = 'Loans';
  let whereObject = null;

  if (req.query.filter === 'overdue') {
    title = 'Overdue Loans';
    whereObject = [{
      return_by: { [Op.lt]: new Date() },
    }, {
      returned_on: null,
    }];
  }
  if (req.query.filter === 'checked_out') {
    title = 'Checked Out Books';
    whereObject = {
      returned_on: null,
    };
  }
  db.loan.findAll({
    where: whereObject,
    include: [{
      model: db.book,
    }, {
      model: db.patron,
    }],
  }).then((loans) => {
    res.render('loans', { loans, title });
  });
});

/**
 * Middleware function
 * Queries the database for all book resources
 * @param req
 * @param res
 * @param next
 */
function findBooks(req, res, next) {
  db.book.findAll().then((books) => {
    req.books = books;
    return next();
  }).catch((error) => {
    winston.log('error', error);
    res.sendStatus(500);
  });
}

/**
 * Middleware function
 * Queries the database for all patron resources
 * @param req
 * @param res
 * @param next
 */
function findPatrons(req, res, next) {
  db.patron.findAll().then((patrons) => {
    req.patrons = patrons;
    return next();
  }).catch((error) => {
    winston.log('error', error);
    res.sendStatus(500);
  });
}

/**
 * Middleware function
 * Creates a date object in order to save today's date and 7 days from now's date to the req object
 * @param req
 * @param res
 * @param next
 */
function getDates(req, res, next) {
  const now = new Date();
  let month = now.getUTCMonth() + 1;
  let day = now.getUTCDate();
  let year = now.getUTCFullYear();
  req.today = `${year}-${month}-${day}`;

  now.setDate(now.getDate() + 7);

  month = now.getUTCMonth() + 1;
  day = now.getUTCDate();
  year = now.getUTCFullYear();
  req.nextWeek = `${year}-${month}-${day}`;

  res.status(200);
  next();
}

/**
 * GET /loans/create
 * Renders the loan creation page
 */
router.get('/create', findBooks, findPatrons, getDates, (req, res) => {
  res.render(
    'loans/create',
    {
      loan: db.loan.build(),
      books: req.books,
      patrons: req.patrons,
      loanDate: req.today,
      dueDate: req.nextWeek,
      title: 'New Loan',
    }
  );
});

/**
 * GET /loans/:id
 * Renders the loan detail page, which is only applicable if the loan can be returned
 */
router.get('/:id', getDates, (req, res) => {
  db.loan.findById(req.params.id, {
    include: [{
      model: db.book,
    }, {
      model: db.patron,
    }],
  }).then((loan) => {
    res.render('loans/detail', { loan, returnedOn: req.today, title: 'Return Book' });
  });
});

/**
 * POST /loans
 * Handler for creating a new loan resource
 */
router.post('/', (req, res) => {
  db.loan.create(req.body).then(() => {
    res.redirect('/loans');
  }).catch((error) => {
    if (error.name === 'SequelizeValidationError') {
      res.render('loans/create', {
        loan: db.loan.build(req.body),
        title: 'New Loan',
        errors: error.errors,
      });
    } else {
      throw error;
    }
  }).catch((error) => {
    winston.log('error', error);
    res.sendStatus(500);
  });
});

/**
 * PUT /loans/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', (req, res) => {
  db.loan.findById(req.params.id).then((loan) => {
    if (!loan) {
      res.sendStatus(404);
    }
    return loan.update(req.body);
  }).then(() => {
    res.redirect('/loans');
  }).catch((error) => {
    if (error.name === 'SequelizeValidationError') {
      const loan = db.loan.build(req.body);
      loan.id = req.params.id;
      res.render('loans/detail', {
        loan,
        title: 'Return Book',
        errors: error.errors,
      });
    }
  });
});

module.exports = router;
