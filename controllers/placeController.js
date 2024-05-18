const placeService = require('../services/placeService');
const { catchAsync } = require('../utils/error');

const getPlaceDetails = catchAsync(async (req, res) => {
  const { placeId } = req.params;

  const result = await placeService.gettingPlaceDetails(placeId);

  return res.status(200).json({ result });
});

const getPlaceHollidays = catchAsync(async (req, res) => {
  const { placeId } = req.params;

  const result = await placeService.gettingHolidays(placeId);

  return res.status(200).json({ result });
});

const getPlaceById = async (req, res) => {
  try {
      const placeId = req.params.placeId;
      const place = await placeService.getPlaceById(placeId);
      res.status(200).json(place);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const getPlaceReviews = async (req, res) => {
  try {
      const placeId = req.params.placeId;
      const reviewsData = await placeService.getPlaceReviews(placeId);
      res.status(200).json(reviewsData);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  console.log("Request body in placeController addReview:", req.body);

  const { userId, placeId, title, content, visitedDate, scores } = req.body;
  console.log("Scores in placeController addReview:", scores); 
  try {
    const {reviewId, averageRating} = await placeService.addReview(userId, placeId, title, content, visitedDate, scores);
    res.status(201).json({ message: "Review added successfully", reviewId, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  console.log("Request body in placeController updateReview:", req.body);
  const { reviewId } = req.params;
  const { userId, title, content, visitedDate, scores } = req.body;

  try {
    const averageRating = await placeService.updateReview(reviewId, userId, title, content, visitedDate, scores);
    res.status(200).json({ message: "Review updated successfully", averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = req.body;

  try {
    const averageRating = await placeService.deleteReview(reviewId, userId);
    res.status(200).json({ message: "Review deleted successfully", averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getPlaceDetails,
  getPlaceHollidays,
  getPlaceById,
  getPlaceReviews,
  addReview,
  updateReview,
  deleteReview
};