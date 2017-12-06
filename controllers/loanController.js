/* eslint-disable comma-dangle,prefer-destructuring */
const winston = require('winston');
const Sequelize = require('sequelize');
const db = require('../db');

const Op = Sequelize.Op;

/**
 * Middleware function
 * Queries the database for all book resources
 * @param req
 * @param res
 * @param next
 */
exports.findBooks = (req, res, next) => {
  db.book.findAll().then((books) => {
    req.books = books;
    return next();
  }).catch((error) => {
    winston.log('error', error);
    res.sendStatus(500);
  });
};

/**
 * Middleware function
 * Queries the database for all patron resources
 * @param req
 * @param res
 * @param next
 */
exports.findPatrons = (req, res, next) => {
  db.patron.findAll().then((patrons) => {
    req.patrons = patrons;
    return next();
  }).catch((error) => {
    winston.log('error', error);
    res.sendStatus(500);
  });
};

/**
 * Middleware function
 * Creates a date object in order to save today's date and 7 days from now's date to the req object
 * @param req
 * @param res
 * @param next
 */
exports.getDates = (req, res, next) => {
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
};

exports.loanList = (req, res) => {
  let title = 'Loans';
  let whereObject = null;
  delete req.session.updateLoanErrors;

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
};

exports.loanCreateGet = (req, res) => {
  res.render(
    'loans/create',
    {
      loan: db.loan.build(),
      books: req.books,
      patrons: req.patrons,
      loanDate: req.today,
      dueDate: req.nextWeek,
      title: 'New Loan',
      errors: req.session.updateLoanErrors,
    }
  );
};

exports.loanDetailGet = (req, res) => {
  db.loan.findById(req.params.id, {
    include: [{
      model: db.book,
    }, {
      model: db.patron,
    }],
  }).then((loan) => {
    if (loan.returned_on !== null) {
      res.sendStatus(404);
    } else {
      res.render('loans/detail', {
        loan, returnedOn: req.today, title: 'Return Book', errors: req.session.updateLoanErrors
      });
    }
  });
};

exports.loanCreatePost = (req, res) => {
  db.loan.create(req.body)
    .then(() => {
      res.redirect('/loans');
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        req.session.updateLoanErrors = error.errors;
        res.redirect('/loans/create');
      } else {
        throw error;
      }
    })
    .catch((error) => {
      winston.log('error', error);
      res.sendStatus(500);
    });
};

exports.loanDetailPut = (req, res) => {
  db.loan.findById(req.params.id).then((loan) => {
    if (!loan) {
      res.sendStatus(404);
    }
    return loan.update(req.body);
  }).then(() => {
    res.redirect('/loans');
  }).catch((error) => {
    if (error.name === 'SequelizeValidationError') {
      req.session.updateLoanErrors = error.errors;
      res.redirect(`/loans/${req.params.id}`);
    }
  });
};
