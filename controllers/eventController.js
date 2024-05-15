const eventService = require('../services/eventService');
const { catchAsync } = require('../utils/error');

const getEventDetails = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await eventService.gettingEventDetails(eventId);

  return res.status(200).json({ result });
});

module.exports = {
  getEventDetails
};