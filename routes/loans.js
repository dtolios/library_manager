/* eslint-disable comma-dangle,prefer-destructuring */
const express = require('express');

const router = express.Router();
const loanController = require('../controllers/loanController');

/**
 * GET /loans
 * Renders the list of loans page
 * If the filter parameter is set, will filter results
 */
router.get('/', loanController.loanList);

/**
 * GET /loans/create
 * Renders the loan creation page
 */
router.get('/create', loanController.findBooks, loanController.findPatrons, loanController.getDates, loanController.loanCreateGet);

/**
 * GET /loans/:id
 * Renders the loan detail page, which is only applicable if the loan can be returned
 */
router.get('/:id', loanController.getDates, loanController.loanDetailGet);

/**
 * POST /loans
 * Handler for creating a new loan resource
 */
router.post('/create', loanController.loanCreatePost);

/**
 * PUT /loans/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', loanController.loanDetailPut);

module.exports = router;
