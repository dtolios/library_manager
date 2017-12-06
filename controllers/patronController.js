/* eslint-disable comma-dangle */
const db = require('../db');

exports.patronList = (req, res) => {
  delete req.session.updatePatronErrors;
  db.patron.findAll().then((patrons) => {
    res.render('patrons', { patrons, title: 'Patrons' });
  });
};

exports.patronCreateGet = (req, res) => {
  res.render('patrons/create', { patrons: db.patron.build(), title: 'New Patron' });
};

exports.patronDetailGet = (req, res) => {
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
      res.render('patrons/detail', {
        patron,
        loans: patron.Loans,
        title: `${patron.first_name} ${patron.last_name}`,
        errors: req.session.updatePatronErrors
      });
    } else {
      res.sendStatus(404);
    }
  });
};

exports.patronCreatePost = (req, res) => {
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
};

exports.patronDetailPut = (req, res) => {
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
        req.session.updatePatronErrors = error.errors;
        res.redirect(`/patrons/${req.params.id}`);
      }
    });
};
