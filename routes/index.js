const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Library Manager' });
});


/* GET all patrons page */
router.get('/all-patrons', function(req, res, next) {
    res.render('all_patrons', { title: 'Patrons' });
});

/* GET all loans page */
router.get('/all-loans', function(req, res, next) {
    res.render('all_loans', { title: 'Loans' });
});

module.exports = router;