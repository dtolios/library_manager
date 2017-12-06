/* eslint-disable comma-dangle,prefer-destructuring */
const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * GET /books
 * Renders the list of books page
 * If the filter parameter is set, will filter results
 */
router.get('/', bookController.bookList);

/**
 * GET /books/create
 * Renders the book creation page
 */
router.get('/create', bookController.bookCreateGet);

/**
 * GET /books/:id
 * Renders the book detail page, which includes the update form
 */
router.get('/:id', bookController.bookDetailGet);

/**
 * POST /books/create
 * Handler for creating a new book resource
 */
router.post('/create', bookController.bookCreatePost);

/**
 * PUT /books/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', bookController.bookDetailPut);

module.exports = router;
