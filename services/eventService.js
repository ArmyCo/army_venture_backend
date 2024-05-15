const { eventDao, appDataSource } = require("../models");

const gettingEventDetails = async (eventId) => {
    const eventDetail = await eventDao.getEventById(eventId);
    const eventImages = await eventDao.getEventImagesById(eventId);
    return { event: eventDetail, eventImages: eventImages };
};

module.exports = {
  gettingEventDetails
}