const { appDataSource } = require("./data-source.js");

const getPlaceById = async (placeId) => {
    const placeDetail = await appDataSource.query(
      `
      SELECT * FROM places
      WHERE id = ?
      `,
      [placeId]
    )
    return placeDetail;
};

const getPlaceImagesByPlaceId = async (placeId) => {
    const placeImages = await appDataSource.query(
      `
      SELECT * FROM place_images
      WHERE place_id = ?
      `,
      [placeId]
    )
    return placeImages;
};

const getRatingsByPlaceId = async (placeId) => {
    const ratingDetails = await appDataSource.query(
      `
      SELECT * 
      FROM place_rating_criterias
      JOIN rating_criterias ON place_rating_criterias.rating_criteria_id = rating_criterias.id
      WHERE place_id = ?
      `,
      [placeId]
    )
    return ratingDetails;
};

const checkPlaceCloseInHollidays = async (placeId) => {
    const checkPlaceHolidays = await appDataSource.query(
      `
      SELECT close_at_holidays FROM places
      WHERE id = ?
      `,
      [placeId]
    )
    return checkPlaceHolidays[0].close_at_holidays;
}

const getHollidaysByPlaceId = async (placeId) => {
    const holidays = await appDataSource.query(
      `
      SELECT * FROM holidays
      `,
      [placeId]
    )
    return holidays;
}

const addReview = async (userId, placeId, title, content, visitedDate) => {
  await appDataSource.query(
    `INSERT INTO place_reviews (user_id, place_id, title, content, visited_date) 
    VALUES (?, ?, ?, ?, ?)`,
    [userId, placeId, title, content, visitedDate]
  );
};

const getReviewScores = async (reviewId) => {
  const scores = await appDataSource.query(
    `SELECT score FROM review_scores WHERE review_id = ?`,
    [reviewId]
  );
  return scores;
};

const calculateReviewRating = async (placeId) => {
  const scores = await appDataSource.query(
    `SELECT score FROM review_scores 
    JOIN place_reviews ON review_scores.review_id = place_reviews.id 
    WHERE place_reviews.place_id = ?`,
    [placeId]
  );

  let totalScore = 0;
  let reviewCount = scores.length;

  scores.forEach(score => {
      totalScore += parseFloat(score.score);
  });

  const averageScore = totalScore / reviewCount;

  if (averageScore <= 2.5) {
      return '별로예요';
  } else if (averageScore <= 3.5) {
      return '보통';
  } else {
      return '좋아요';
  }
};

module.exports = {
    getPlaceById,
    getPlaceImagesByPlaceId,
    getRatingsByPlaceId,
    checkPlaceCloseInHollidays,
    getHollidaysByPlaceId,
    addReview,
    getReviewScores,
    calculateReviewRating
}