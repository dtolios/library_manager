const express = require('express');

const router = express.Router();

/**
 * GET /
 * Renders the home page
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Library Manager' });
});

module.exports = router;
