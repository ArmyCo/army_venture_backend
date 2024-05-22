const userService = require('../services/userService');
const { catchAsync } = require('../utils/error');

const getUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userService.gettingUserDetails(userId);

  return res.status(200).json({ result });
});

const updateUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { nickname, user_army_number, phone_number, belonged_unit_id } = req.body;

  const result = await userService.updatingUserDetails(userId, nickname, user_army_number, phone_number, belonged_unit_id);

  return res.status(200).json({ result });
});

const deleteUserDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { withdrawReasonId, reasonDetail } = req.body;

  await userService.deletingUserDetails(userId, withdrawReasonId, reasonDetail);

  return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다."});
});

module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUserDetails
};