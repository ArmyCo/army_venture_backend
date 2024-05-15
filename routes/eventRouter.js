const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/all', eventController.getAllEvents);
router.get('/:eventId', eventController.getEventDetails);

module.exports = { router };