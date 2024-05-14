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

const getReviewByPlaceId = async (placeId) => {
    const reviewDetail = await appDataSource.query(
      `
      SELECT pr.id AS review_id, pr.user_id, pr.title AS review_title, pr.content AS review_content, pr.visited_date, pr.created_at, pr.updated_at
      FROM place_reviews pr
      LEFT JOIN(
        SELECT
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "rating_criteria_id", rs.rating_criteria_id,
            "rating_criteria_name", rc.rating_title,
            "score", rs.score
          )
        ) AS reviewScores
        FROM review_scores rs, rating_criteria rc
        WHERE  rs.rating_criteria_id = rc.id
      ) ON pr.id = rs.review_id
      AND pr.place_id = ?
      GROUP BY pr.id
      `,
      [placeId]
    )
    return reviewDetail;
};

module.exports = {
    getPlaceById,
    getReviewByPlaceId
}