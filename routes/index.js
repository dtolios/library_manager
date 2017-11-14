const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Library Manager' });
});

/* GET all books page */
router.get('/all-books', function(req, res, next) {
    res.render('all_books', { title: 'Books' });
});

/* GET all patrons page */
router.get('/all-patrons', function(req, res, next) {
    res.render('all_patrons', { title: 'Patrons' });
});

module.exports = router;