const courseService = require('../services/courseService');
const { catchAsync } = require('../utils/error');

const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseService.gettingAllCourses();

  return res.status(200).json({ result });
});

const getCourseDetails = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await courseService.gettingCourseDetails(courseId);

  return res.status(200).json({ result });
});

module.exports = {
  getAllCourses,
  getCourseDetails
};