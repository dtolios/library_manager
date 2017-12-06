/* eslint-disable comma-dangle */
const express = require('express');

const router = express.Router();
const patronController = require('../controllers/patronController');

/**
 * GET /patrons
 * Renders the patron list page
 */
router.get('/', patronController.patronList);

/**
 * GET /patrons/create
 * Renders the patron creation page
 */
router.get('/create', patronController.patronCreateGet);

/**
 * GET /patrons/:id
 * Renders the patron detail page, which includes the update form
 */
router.get('/:id', patronController.patronDetailGet);

/**
 * POST /patrons/create
 * Handler for creating a new patron resource
 */
router.post('/create', patronController.patronCreatePost);

/**
 * PUT /patrons/:id
 * Handler for updating an existing patron resource
 */
router.put('/:id', patronController.patronDetailPut);

module.exports = router;
