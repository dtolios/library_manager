/* eslint-disable comma-dangle,prefer-destructuring */
const express = require('express');
const router = express.Router();

const book_controller = require('../controllers/bookController');

/**
 * GET /books
 * Renders the list of books page
 * If the filter parameter is set, will filter results
 */
router.get('/', book_controller.index);

/**
 * GET /books/create
 * Renders the book creation page
 */
router.get('/create', book_controller.book_create_get);

/**
 * GET /books/:id
 * Renders the book detail page, which includes the update form
 */
router.get('/:id', book_controller.book_detail_get);

/**
 * POST /books
 * Handler for creating a new book resource
 */
router.post('/', book_controller.book_create_post);

/**
 * PUT /books/:id
 * Handler for updating an existing book resource
 */
router.put('/:id', book_controller.book_detail_put);

module.exports = router;
