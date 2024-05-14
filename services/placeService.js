const { placeDao, appDataSource } = require("../models");

const gettingPlaceDetails = async (placeId) => {
    const placeDetail = await placeDao.getPlaceById(placeId);
    const reviewList = await placeDao.getReviewByPlaceId(placeId);
    return { place: placeDetail, reviews: reviewList };
};

module.exports = {
  gettingPlaceDetails
}