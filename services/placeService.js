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

module.exports = {
  gettingPlaceDetails,
  gettingHolidays
}