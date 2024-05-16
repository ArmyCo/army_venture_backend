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

const getPlaceById = async (req, res) => {
  try {
      const placeId = req.params.placeId;
      const place = await placeService.getPlaceById(placeId);
      res.status(200).json(place);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
      const userId = req.user.id; // loginRequired 미들웨어를 통과한 경우 user 객체가 req에 포함됩니다.
      const placeId = req.params.placeId;
      const { title, content, visitedDate } = req.body;

      await placeService.addReview(userId, placeId, title, content, visitedDate);
      res.status(201).json({ message: '리뷰가 성공적으로 등록되었습니다.' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlaceDetails,
  getPlaceHollidays,
  addReview,
  getPlaceById
};