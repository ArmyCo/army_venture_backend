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

module.exports = {
    getPlaceById,
    getPlaceImagesByPlaceId,
    getRatingsByPlaceId,
    checkPlaceCloseInHollidays,
    getHollidaysByPlaceId
}