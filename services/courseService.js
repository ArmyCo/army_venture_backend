const courseDao = require("../models/courseDao");

const gettingAllCourses = async () => {
  const allCourses = await courseDao.getAllCourses();
  return { totalCourses: allCourses };
}

const gettingCourseDetails = async (courseId) => {
    const courseDetail = await courseDao.getCourseById(courseId);
    const placesInCourse = await courseDao.getPlacesesByCourseId(courseId);
    return { course: courseDetail, placesInCourse: placesInCourse };
};

const creatingCourse = async (userId, course_title, with_who_id, description) => {
  const courseId = await courseDao.createCourse(userId, course_title, with_who_id, description);

  return { createdCourseId: courseId };
}

const addingPlaceInCourse = async (userId, courseId, placeId, placeLike) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return userCheck;
  }else{
    await courseDao.addPlaceInCourse(courseId, placeId, placeLike);
  }
}

const updatingCourseDetail = async (userId, courseId, course_title, with_who_id, description) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return userCheck;
  }else{
    await courseDao.updateCourseDetail(courseId, course_title, with_who_id, description);
  }
}

const deletingCourse = async (userId, courseId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return userCheck;
  }else{
    await courseDao.deleteCourse(courseId);
  }
}

const deletingPlaceInCourse = async (userId, courseId, placeId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return userCheck;
  }else{
    await courseDao.deletePlaceInCourse(courseId, placeId);
  }
}

const addingCourseLike = async (userId, courseId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  const userLikedCheck = await courseDao.userLikedCheck(userId, courseId);
  if(userCheck == 1 || userLikedCheck == 1) {
    return 1;
  }else{
    await courseDao.addCourseLike(userId, courseId);
  }
}

const deletingCourseLike = async (userId, courseId) => {
  const userLikedCheck = await courseDao.userLikedCheck(userId, courseId);
  if(userLikedCheck == 0) {
    return userLikedCheck;
  }else{
    await courseDao.deleteCourseLike(userId, courseId);
  }
}


module.exports = {
  gettingAllCourses,
  gettingCourseDetails,
  creatingCourse,
  addingPlaceInCourse,
  updatingCourseDetail,
  deletingCourse,
  deletingPlaceInCourse,
  addingCourseLike,
  deletingCourseLike
}