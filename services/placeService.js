const { placeDao, appDataSource } = require("../models");

const gettingPlaceDetails = async (placeId) => {
    const placeDetail = await placeDao.getPlaceById(placeId);
    const reviewList = await placeDao.getReviewByPlaceId(placeId);
    const placeImages = await placeDao.getPlaceImagesByPlaceId(placeId);
    return { place: placeDetail, placeImages: placeImages,reviews: reviewList };
};

const gettingHolidays = async (placeId) => {
  const holidays = await placeDao.getHollidaysByPlaceId(placeId);
  const closeInHollidays = await placeDao.checkPlaceCloseInHollidays(placeId);

  if (closeInHollidays == 1) {
    return { holidays: holidays , publicHollidays: holidays};
  }
  return {holidays: holidays};
};

module.exports = {
  gettingPlaceDetails,
  gettingHolidays
}