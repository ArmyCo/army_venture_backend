const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { loginRequired } = require('../utils/auth');

router.get('/:placeId', placeController.getPlaceDetails);
router.get('/:placeId/holidays', placeController.getPlaceHollidays);
router.post('/:placeId/reviews', loginRequired, placeController.addReview);

module.exports = { router };