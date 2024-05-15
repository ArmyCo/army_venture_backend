const { eventDao, appDataSource } = require("../models");

const gettingAllEvents = async () => {
  const allEvents = await eventDao.getAllEvents();
  return { totalEvents: allEvents };
}

const gettingEventDetails = async (eventId) => {
    const eventDetail = await eventDao.getEventById(eventId);
    const eventImages = await eventDao.getEventImagesById(eventId);
    return { event: eventDetail, eventImages: eventImages };
};

module.exports = {
  gettingAllEvents,
  gettingEventDetails
}