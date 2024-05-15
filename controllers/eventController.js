const eventService = require('../services/eventService');
const { catchAsync } = require('../utils/error');

const getAllEvents = catchAsync(async (req, res) => {
  const result = await eventService.gettingAllEvents();

  return res.status(200).json({ result });
});

const getEventDetails = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await eventService.gettingEventDetails(eventId);

  return res.status(200).json({ result });
});

module.exports = {
  getAllEvents,
  getEventDetails
};