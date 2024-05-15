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
}

const getReviewByPlaceId = async (placeId) => {
    const reviewDetail = await appDataSource.query(
      `
      SELECT pr.id AS review_id, pr.user_id, pr.title AS review_title, pr.content AS review_content, pr.visited_date, pr.created_at, pr.updated_at,
      reviewScores.reviewScores
      FROM place_reviews pr
      LEFT JOIN (
        SELECT
          rs.review_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              "rating_criteria_id", rs.rating_criteria_id,
              "rating_criteria_name", rc.rating_title,
              "score", rs.score
            )
          ) AS reviewScores
        FROM review_scores rs
        JOIN rating_criterias rc ON rs.rating_criteria_id = rc.id
        GROUP BY rs.review_id
      ) AS reviewScores ON pr.id = reviewScores.review_id
      WHERE pr.place_id = ?
      `,
      [placeId]
    )
    return reviewDetail;
};

module.exports = {
    getPlaceById,
    getPlaceImagesByPlaceId,
    getReviewByPlaceId
}