const { appDataSource } = require("./data-source.js");

const getPlaceById = async (placeId) => {
    const placeDetail = await appDataSource.query(
      `SELECT * FROM places WHERE id = ?`,
      [placeId]
    );
    return placeDetail;
};

const getPlaceImagesByPlaceId = async (placeId) => {
    const placeImages = await appDataSource.query(
      `SELECT * FROM place_images WHERE place_id = ?`,
      [placeId]
    );
    return placeImages;
};

const getRatingsByPlaceId = async (placeId) => {
    const ratingDetails = await appDataSource.query(
      `SELECT * FROM place_rating_criterias
       JOIN rating_criterias ON place_rating_criterias.rating_criteria_id = rating_criterias.id
       WHERE place_id = ?`,
      [placeId]
    );
    return ratingDetails;
};

const checkPlaceCloseInHollidays = async (placeId) => {
    const checkPlaceHolidays = await appDataSource.query(
      `SELECT close_at_holidays FROM places WHERE id = ?`,
      [placeId]
    );
    return checkPlaceHolidays[0].close_at_holidays;
};

const getHollidaysByPlaceId = async (placeId) => {
    const holidays = await appDataSource.query(`SELECT * FROM holidays`, [placeId]);
    return holidays;
};

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

const getMyPlaceReviews = async (userId) => {
  const reviews = await appDataSource.query(
    `SELECT * FROM place_reviews WHERE user_id = ?`,
    [userId]
  );
  return reviews;
};

const addReview = async (userId, placeId, title, content, visitedDate, scores) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await queryRunner.query(
      `INSERT INTO place_reviews (user_id, place_id, title, content, visited_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, placeId, title, content, visitedDate]
    );

    if (scores && scores.length > 0) {
      for (const score of scores) {
        await queryRunner.query(
          `INSERT INTO review_scores (review_id, place_rating_criteria_id, score)
           VALUES (?, ?, ?)`,
          [result.insertId, score.ratingCriteriaId, score.score]
        );
        await queryRunner.query(
          `INSERT INTO place_rating_criterias (place_id, rating_criteria_id, review_count, score_avg) 
           VALUES (?, ?, 1, ?)
           ON DUPLICATE KEY UPDATE 
           review_count = review_count + 1, 
           score_avg = (score_avg * (review_count - 1) + VALUES(score_avg)) / review_count`,
          [placeId, score.ratingCriteriaId, score.score]
        );
      }
    }

    await queryRunner.commitTransaction();
    return result.insertId;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error in addReview:", error);
    throw new Error("Failed to add review");
  } finally {
    await queryRunner.release();
  }
};

const updateReview = async (reviewId, userId, title, content, visitedDate) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  await queryRunner.connect();

  try {
    await queryRunner.query(
      `UPDATE place_reviews SET title = ?, content = ?, visited_date = ? 
       WHERE id = ? AND user_id = ?`,
      [title, content, visitedDate, reviewId, userId]
    );

    await queryRunner.query(
      `DELETE FROM review_scores WHERE review_id = ?`,
      [reviewId]
    );

    if (scores && scores.length > 0) {
      for (const score of scores) {
        await queryRunner.query(
          `INSERT INTO review_scores (review_id, place_rating_criteria_id, score)
           VALUES (?, ?, ?)`,
          [reviewId, score.ratingCriteriaId, score.score]
        );
        await queryRunner.query(
          `UPDATE place_rating_criterias
           SET review_count = review_count - 1,
               score_avg = (score_avg * (review_count + 1) - ?) / review_count
           WHERE place_id = ? AND rating_criteria_id = ?`,
          [score.score, placeId, score.ratingCriteriaId]
        );
        await queryRunner.query(
          `INSERT INTO place_rating_criterias (place_id, rating_criteria_id, review_count, score_avg)
           VALUES (?, ?, 1, ?)
           ON DUPLICATE KEY UPDATE 
           review_count = review_count + 1, 
           score_avg = (score_avg * (review_count - 1) + VALUES(score_avg)) / review_count`,
          [placeId, score.ratingCriteriaId, score.score]
        );
      }
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error in updateReview:", error);
    throw new Error("Failed to update review");
  } finally {
    await queryRunner.release();
  }
};

const deleteReview = async (reviewId, userId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  await queryRunner.connect();

  try {
    const reviewScores = await queryRunner.query(
      `SELECT place_rating_criteria_id, score FROM review_scores WHERE review_id = ?`,
      [reviewId]
    );

    await queryRunner.query(
      `DELETE FROM review_scores WHERE review_id = ?`,
      [reviewId]
    );

    for (const reviewScore of reviewScores) {
      await queryRunner.query(
        `UPDATE place_rating_criterias
         SET review_count = review_count - 1,
             score_avg = (score_avg * (review_count + 1) - ?) / review_count
         WHERE place_id = ? AND rating_criteria_id = ?`,
        [reviewScore.score, placeId, reviewScore.place_rating_criteria_id]
      );
    }

    await queryRunner.query(
      `DELETE FROM place_reviews WHERE id = ? AND user_id = ?`,
      [reviewId, userId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error in deleteReview:", error);
    throw new Error("Failed to delete review");
  } finally {
    await queryRunner.release();
  }
};

const addReviewScores = async (reviewId, placeId, scores) => {
  if (!scores || scores.length === 0) {
    console.error("No scores data provided.");
    return;
  }

  const promises = scores.map(async (score) => {
    const existingCriteria = await appDataSource.query(
      `SELECT * FROM place_rating_criterias WHERE place_id = ? AND rating_criteria_id = ?`,
      [placeId, score.ratingCriteriaId]
    );

    if (existingCriteria.length === 0) {
      await appDataSource.query(
        `INSERT INTO place_rating_criterias (place_id, rating_criteria_id, review_count, score_avg) 
        VALUES (?, ?, ?, ?)`,
        [placeId, score.ratingCriteriaId, 1, score.score]
      );
    } else {
      const { review_count, score_avg } = existingCriteria[0];
      const newReviewCount = review_count + 1;
      const newScoreAvg = ((score_avg * review_count) + score.score) / newReviewCount;

      await appDataSource.query(
        `UPDATE place_rating_criterias 
        SET review_count = ?, score_avg = ? 
        WHERE place_id = ? AND rating_criteria_id = ?`,
        [newReviewCount, newScoreAvg, placeId, score.ratingCriteriaId]
      );
    }

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
  }
};

const updateReviewScores = async (reviewId, scores) => {
  await appDataSource.query(`DELETE FROM review_scores WHERE review_id = ?`, [reviewId]);
  addReviewScores(reviewId, scores);
};

const updateRatingCriterias = async (placeId, ratingCriteriaId, score) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const currentData = await queryRunner.query(
      `SELECT review_count, score_avg FROM place_rating_criterias
       WHERE place_id = ? AND rating_criteria_id = ?`,
      [placeId, ratingCriteriaId]
    );

    let newReviewCount, newScoreAvg;

    if (currentData.length === 0) {
      newReviewCount = 1;
      newScoreAvg = score;

      await queryRunner.query(
        `INSERT INTO place_rating_criterias (place_id, rating_criteria_id, review_count, score_avg)
         VALUES (?, ?, ?, ?)`,
        [placeId, ratingCriteriaId, newReviewCount, newScoreAvg]
      );
    } else {
      const { review_count, score_avg } = currentData[0];
      newReviewCount = review_count + 1;
      newScoreAvg = ((score_avg * review_count) + score) / newReviewCount;

      await queryRunner.query(
        `UPDATE place_rating_criterias
         SET review_count = ?, score_avg = ?
         WHERE place_id = ? AND rating_criteria_id = ?`,
        [newReviewCount, newScoreAvg, placeId, ratingCriteriaId]
      );
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error in updateRatingCriterias:", error);
    throw new Error("Failed to update rating criterias");
  } finally {
    await queryRunner.release();
  }
};

const checkPlaceExists = async (placeId) => {
  const result = await appDataSource.query(
    `SELECT COUNT(*) as count FROM places WHERE id = ?`,
    [placeId]
  );
  return result[0].count > 0;
};

const calculateReviewRating = async (placeId) => {
  const scores = await appDataSource.query(
    `SELECT score FROM review_scores 
     JOIN place_reviews ON review_scores.review_id = place_reviews.id 
     WHERE place_reviews.place_id = ?`,
    [placeId]
  );

  console.log("Scores from DB:", scores);

  let totalScore = 0;
  let reviewCount = scores.length;

  if (reviewCount === 0) {
    return '평가 없음';
  }

  scores.forEach(score => {
    totalScore += parseFloat(score.score);
  });

  const averageScore = totalScore / reviewCount;

  console.log("Total score:", totalScore);
  console.log("Review count:", reviewCount);
  console.log("Average score:", averageScore);

  if (averageScore <= 2.5) {
    return '별로예요';
  } else if (averageScore <= 3.5) {
    return '보통';
  } else {
    return '좋아요';
  }
};

const getReviewScores = async (reviewId) => {
  const scores = await appDataSource.query(
    `SELECT * FROM review_scores WHERE review_id = ?`,
    [reviewId]
  );
  return scores;
};

module.exports = {
    getPlaceById,
    getPlaceImagesByPlaceId,
    getRatingsByPlaceId,
    checkPlaceCloseInHollidays,
    getHollidaysByPlaceId,
    getReviewsByPlaceId,
    getMyPlaceReviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewScores,
    calculateReviewRating,
    getReviewById,
    addReviewScores,
    updateReviewScores,
    updateRatingCriterias,
    checkPlaceExists
};
