const placeService = require('../services/placeService');
const { catchAsync } = require('../utils/error');

const getPlaceDetails = catchAsync(async (req, res) => {
  const { placeId } = req.params;

  const result = await placeService.gettingPlaceDetails(placeId);

  return res.status(200).json({ result });
});

const getPlaceHollidays = catchAsync(async (req, res) => {
  const { placeId } = req.params;

  const result = await placeService.gettingHolidays(placeId);

  return res.status(200).json({ result });
});

module.exports = {
  getPlaceDetails,
  getPlaceHollidays
};