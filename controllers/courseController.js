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

const createCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { course_title, with_who_id, description } = req.body;

  const createdCourseId = await courseService.creatingCourse(userId, course_title, with_who_id, description);
  return res.status(201).json({ createdCourseId });
});

const addPlaceInCourse = catchAsync(async (req, res) => {
  const { courseId, placeId } = req.body;

  await courseService.addingPlaceInCourse(courseId, placeId);
  return res.status(201).json({ message: '장소가 성공적으로 코스에 추가되었습니다.'});
});

module.exports = {
  getAllCourses,
  getCourseDetails,
  createCourse,
  addPlaceInCourse
};