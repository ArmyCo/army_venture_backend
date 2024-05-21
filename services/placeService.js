const { placeDao, appDataSource } = require("../models");

const gettingPlaceDetails = async (placeId) => {
    const placeDetail = await placeDao.getPlaceById(placeId);
    const placeImages = await placeDao.getPlaceImagesByPlaceId(placeId);
    const placeRatings = await placeDao.getRatingsByPlaceId(placeId);
    return { place: placeDetail, placeImages: placeImages, ratings: placeRatings};
};

const gettingHolidays = async (placeId) => {
  const holidays = await placeDao.getHollidaysByPlaceId(placeId);
  const closeInHollidays = await placeDao.checkPlaceCloseInHollidays(placeId);

  if (closeInHollidays == 1) {
    return { publicHollidays: holidays};
  }
  return { "message": "This place is open in hollidays" };
};

const addReview = async (userId, placeId, title, content, visitedDate, scores) => {
  console.log("Scores in placeService addReview:", scores);
  console.log("Place ID:", placeId);

  const placeExists = await placeDao.checkPlaceExists(placeId);
  if (!placeExists) {
    throw new Error("Place not found");
  }

  const reviewId = await placeDao.addReview(userId, placeId, title, content, visitedDate);
  await placeDao.addReviewScores(reviewId, placeId, scores);

  for (const score of scores) {
    await placeDao.updateRatingCriterias(placeId, score.ratingCriteriaId, score.score);
  }

  const averageRating = await placeDao.calculateReviewRating(placeId);
  console.log("Average rating:", averageRating); // 평균 평점 로그 추가
  return { reviewId, averageRating };
};

const updateReview = async (reviewId, userId, title, content, visitedDate, scores) => {
  await placeDao.updateReview(reviewId, userId, title, content, visitedDate);
  const placeId = (await placeDao.getReviewById(reviewId)).place_id;
  await placeDao.updateReviewScores(reviewId, placeId, scores);

  for (const score of scores) {
    await placeDao.updateRatingCriterias(placeId, score.ratingCriteriaId, score.score);
  }

  const averageRating = await placeDao.calculateReviewRating(placeId);
  console.log("Average rating:", averageRating); // 평균 평점 로그 추가
  return averageRating;
};


const deleteReview = async (reviewId, userId) => {
  const review = await placeDao.getReviewById(reviewId);
  const placeId = review.place_id;

  await placeDao.deleteReview(reviewId, userId);

  const averageRating = await placeDao.calculateReviewRating(placeId);
  return averageRating;
};

module.exports = {
  gettingPlaceDetails,
  gettingHolidays,
  addReview,
  updateReview,
  deleteReview
}