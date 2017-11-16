const express   = require('express');
const db        = require('../db');
const Sequelize = require('sequelize');

const router    = express.Router();
const Op        = Sequelize.Op;

/* GET books list page */
router.get('/', function(req, res, next) {
    let whereObj = {};
    let title = 'Books';
    if (req.query.overdue) {
      title = 'Overdue Books';
        whereObj = [
          {
            return_by: {[Op.lt]: new Date()}
          },
          {
            returned_on: null
          }
        ];
    }
    if (req.query.checkedOut) {
      title = 'Checked Out Books';
      whereObj = [
        {
          returned_on: null
        }
      ];
    }

    db.book.findAll({
      include: [
        {
          model: db.loan,
          where: whereObj
        }
      ]
    }).then(function(books) {
        res.render('books', { books: books, title: title });
    });
});

router.get('/new', function(req, res, next) {
    res.render('books_new', {title: 'New Book'})
});

module.exports = router;
