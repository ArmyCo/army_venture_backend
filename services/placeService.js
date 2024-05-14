const { placeDao, appDataSource } = require("../models");

const gettingPlaceDetails = async (placeId) => {
    const placeDetail = await placeDao.getPlaceById(placeId);
    const reviewList = await placeDao.getReviewByPlaceId(placeId);
    const placeImages = await placeDao.getPlaceImagesByPlaceId(placeId);
    return { place: placeDetail, placeImages: placeImages,reviews: reviewList };
};

module.exports = {
  gettingPlaceDetails
}