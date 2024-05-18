const userService = require('../services/userService');
const { catchAsync } = require('../utils/error');

const getUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userService.gettingUserDetails(userId);

  return res.status(200).json({ result });
});

const updateUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { nickname, profile_image, introduction } = req.body;

  const result = await userService.updatingUserDetails(userId, nickname, profile_image, introduction);

  return res.status(200).json({ result });
});

module.exports = {
  getUserDetails
};