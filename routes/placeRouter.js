const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/:placeId', placeController.getPlaceDetails);
router.get('/:placeId/holidays', placeController.getPlaceHollidays);

module.exports = { router };