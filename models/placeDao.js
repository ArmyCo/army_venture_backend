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

const getReviewsByPlaceId = async (placeId) => {
  const reviews = await appDataSource.query(
    `SELECT place_reviews.*, users.name as user_name, review_scores.score as score 
    FROM place_reviews 
    JOIN users ON place_reviews.user_id = users.id
    LEFT JOIN review_scores ON place_reviews.id = review_scores.review_id
    WHERE place_reviews.place_id = ?`,
    [placeId]
  );
  return reviews;
};

const getReviewById = async (reviewId) => {
  const review = await appDataSource.query(
    `SELECT * FROM place_reviews WHERE id = ?`,
    [reviewId]
  );
  return review[0];
};

const addReview = async (userId, placeId, title, content, visitedDate, scores) => {
  try {
    const result = await appDataSource.query(
      `INSERT INTO place_reviews (user_id, place_id, title, content, visited_date) 
      VALUES (?, ?, ?, ?, ?)`,
      [userId, placeId, title, content, visitedDate]
    );

    console.log("Scores received in addReview:", scores);

    // scores 처리
    if (scores && scores.length > 0) {
      await addReviewScores(result.insertId, scores);
    } else {
      console.error("No scores data provided or empty scores array.");
    }

    return result.insertId;
  } catch (error) {
    console.error("Error in addReview:", error);
    throw new Error("Failed to add review");
  }
};

const updateReview = async (reviewId, userId, title, content, visitedDate) => {
  await appDataSource.query(
    `UPDATE place_reviews SET title = ?, content = ?, visited_date = ? 
    WHERE id = ? AND user_id = ?`,
    [title, content, visitedDate, reviewId, userId]
  );

  //await updateReviewScores(reviewId, scores);
};

const deleteReview = async (reviewId, userId) => {
  await appDataSource.query(
    `DELETE FROM review_scores WHERE review_id = ?`,
    [reviewId]
  );

  await appDataSource.query(
    `DELETE FROM place_reviews WHERE id = ? AND user_id = ?`,
    [reviewId, userId]
  );
};

const getReviewScores = async (reviewId) => {
  const scores = await appDataSource.query(
    `SELECT score FROM review_scores WHERE review_id = ?`,
    [reviewId]
  );
  return scores;
};

const addReviewScores = async (reviewId, scores) => {
  if (!scores || scores.length === 0) {
    console.error("No scores data provided or scores array is empty.");
    return;
  }

  const promises = scores.map(score => {
    return appDataSource.query(
      `INSERT INTO review_scores (review_id, place_rating_criteria_id, score)
      VALUES (?, ?, ?)`,
      [reviewId, score.ratingCriteriaId, score.score]
    ).catch(err => console.error('Error inserting score:', err));
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Failed to insert review scores:", error);
    throw new Error("Failed to insert review scores");
  }
};

const updateReviewScores = async (reviewId, scores) => {
  await appDataSource.query(
    `DELETE FROM review_scores WHERE review_id = ?`,
    [reviewId]
  );

  addReviewScores(reviewId, scores);
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
    getReviewsByPlaceId,
    addReview,
    updateReview,
    deleteReview,
    getReviewScores,
    calculateReviewRating,
    getReviewById,
    addReviewScores,
    updateReviewScores
}