const { appDataSource } = require("./data-source.js");

const getAllEvents = async () => {
    const allEvents = await appDataSource.query(
      `
      SELECT * FROM events_and_promotions
      `
    )
    return allEvents;
};

const getEventById = async (eventId) => {
    const eventDetail = await appDataSource.query(
      `
      SELECT * FROM events_and_promotions
      WHERE id = ?
      `,
      [eventId]
    )
    return eventDetail;
};

const getEventImagesById = async (eventId) => {
    const eventImages = await appDataSource.query(
      `
      SELECT * FROM event_images
      WHERE event_id = ?
      `,
      [eventId]
    )
    return eventImages;
}

module.exports = {
    getAllEvents,
    getEventById,
    getEventImagesById
}