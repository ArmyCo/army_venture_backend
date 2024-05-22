const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { loginRequired } = require('../utils/auth');

router.get('/:placeId/holidays', placeController.getPlaceHollidays);
router.get('/:placeId', placeController.getPlaceDetails);
router.get('/:placeId/reviews', placeController.getPlaceReviews);
router.get('/reviews/my', loginRequired, placeController.getMyPlaceReviews);

router.post('/:placeId/reviews', loginRequired, placeController.addReview);

router.put('/reviews/:reviewId', loginRequired, placeController.updateReview);

router.delete('/reviews/:reviewId', loginRequired, placeController.deleteReview);

module.exports = { router };