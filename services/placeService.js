const { placeDao, appDataSource } = require("../models");

const gettingPlaceDetails = async (placeId) => {
    const placeDetail = await placeDao.getPlaceById(placeId);
    return { place: placeDetail };
};

module.exports = {
  gettingPlaceDetails
}