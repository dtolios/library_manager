const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Library Manager' });
});

/* GET page */
router.get('/all-books', function(req, res, next) {
    res.render('all_books', { title: 'Books' });
});

module.exports = router;