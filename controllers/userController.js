const userService = require('../services/userService');
const { catchAsync } = require('../utils/error');

const getUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userService.gettingUserDetails(userId);

  return res.status(200).json({ result });
});


module.exports = {
  getUserDetails
};