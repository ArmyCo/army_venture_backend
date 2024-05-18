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

// const addReview = async (userId, placeId, title, content, visitedDate, scores) => {
//   console.log("Scores in placeService addReview:", scores);
//   console.log("Place ID:", placeId);

//   const placeExists = await placeDao.checkPlaceExists(placeId);
//   if (!placeExists) {
//     throw new Error("Place not found");
//   }

//   const reviewId = await placeDao.addReview(userId, placeId, title, content, visitedDate, scores);
//   const avergeRating = await placeDao.calculateReviewRating(placeId);
//   return {reviewId, avergeRating};
// };


// const updateReview = async (reviewId, userId, title, content, visitedDate, scores) => {
//   await placeDao.updateReview(reviewId, userId, title, content, visitedDate);
//   await placeDao.updateReviewScores(reviewId, scores);  // 기존 평점 삭제 후 새로운 평점 추가
//   const review = await placeDao.getReviewById(reviewId);
//   const avergeRating = await placeDao.calculateReviewRating(reviewId);
//   return {review, avergeRating};
// };

// const deleteReview = async (reviewId, userId) => {
//   await placeDao.deleteReview(reviewId, userId);
//   const avergeRating = await placeDao.calculateReviewRating(reviewId);
//   return avergeRating;
// };
const addReview = async (userId, placeId, title, content, visitedDate, scores) => {
  console.log("Scores in placeService addReview:", scores);
  console.log("Place ID:", placeId);

  const placeExists = await placeDao.checkPlaceExists(placeId);
  if (!placeExists) {
    throw new Error("Place not found");
  }

  const reviewId = await placeDao.addReview(userId, placeId, title, content, visitedDate);
  await placeDao.addReviewScores(reviewId, placeId, scores); // placeId 추가 

  for (const score of scores) {
    await placeDao.updateRatingCriterias(placeId, score.ratingCriteriaId, score.score);
  }

  const averageRating = await placeDao.calculateReviewRating(placeId);
  return { reviewId, averageRating };
};

const updateReview = async (reviewId, userId, title, content, visitedDate, scores) => {
  await placeDao.updateReview(reviewId, userId, title, content, visitedDate);
  await placeDao.updateReviewScores(reviewId, scores);  // 기존 평점 삭제 후 새로운 평점 추가

  const placeId = (await placeDao.getPlaceById(reviewId))[0].place_id;
  for (const score of scores) {
    await placeDao.updateRatingCriterias(placeId, score.ratingCriteriaId, score.score);
  }

  const averageRating = await placeDao.calculateReviewRating(placeId);
  return averageRating;
};

const deleteReview = async (reviewId, userId) => {
  const placeId = (await placeDao.getPlaceById(reviewId))[0].place_id;
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