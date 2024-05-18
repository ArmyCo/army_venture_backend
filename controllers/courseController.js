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

const getCoursesWithWho = catchAsync(async (req, res) => {
  const { withWhoId } = req.params;

  const result = await courseService.gettingCoursesWithWho(withWhoId);

  return res.status(200).json({ result });
});

const createCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { course_title, with_who_id, description } = req.body;

  const createdCourseId = await courseService.creatingCourse(userId, course_title, with_who_id, description);
  
  return res.status(201).json({ createdCourseId });
});

const addPlaceInCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  const { placeId, placeLike } = req.body;

  if (!userId || !courseId || !placeId || !placeLike) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.addingPlaceInCourse(userId, courseId, placeId, placeLike);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }

  return res.status(201).json({ message: "장소가 성공적으로 코스에 추가되었습니다."});
});

const updateCourseDetail = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  const { course_title, with_who_id, description } = req.body;
  
  if (!userId || !courseId || !course_title || !with_who_id || !description) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.updatingCourseDetail(userId, courseId, course_title, with_who_id, description);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }

  return res.status(200).json({ message: '코스 정보가 성공적으로 수정되었습니다.'});
});

const deleteCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  if (!userId || !courseId) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.deletingCourse(userId, courseId);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }

  return res.status(200).json({ message: "코스가 성공적으로 삭제되었습니다."});
});

const deletePlaceInCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId, placeId } = req.params;

  if (!userId || !courseId || !placeId) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.deletingPlaceInCourse(userId, courseId, placeId);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }
  
  return res.status(200).json({ message: "장소가 성공적으로 코스에서 삭제되었습니다."});
});

const addCourseLike =  catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  if (!userId || !courseId) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.addingCourseLike(userId, courseId);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }
  
  return res.status(200).json({ message: "코스가 성공적으로 좋아요 되었습니다."});
});

const deleteCourseLike = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  if (!userId || !courseId) {
    return res.status(400).json({ message: "KEY_MISSING" });
  }
  const userCheck = await courseService.deletingCourseLike(userId, courseId);
  if (userCheck != 1) {
    return res.status(500).json({ message: "INVALID_ACCESS_TO_THIS_COURSE" });
  }
  
  return res.status(200).json({ message: "코스 좋아요가 성공적으로 취소되었습니다."});
});


module.exports = {
  getAllCourses,
  getCourseDetails,
  getCoursesWithWho,
  createCourse,
  addPlaceInCourse,
  updateCourseDetail,
  deleteCourse,
  deletePlaceInCourse,
  addCourseLike,
  deleteCourseLike
};