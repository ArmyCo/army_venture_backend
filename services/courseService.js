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
  const usercheck = await courseDao.userCourseCheck(userId, courseId);
  if(usercheck != 1) {
    return { message: "INVALID_ACCESS_TO_THIS_COURSE" };
  }

  await courseDao.addPlaceInCourse(courseId, placeId, placeLike);
}

const updatingCourseDetail = async (userId, courseId, course_title, with_who_id, description) => {
  const usercheck = await courseDao.userCourseCheck(userId, courseId);
  if(usercheck != 1) {
    return { message: "INVALID_ACCESS_TO_THIS_COURSE" };
  }else{
    await courseDao.updateCourseDetail(userId, courseId, course_title, with_who_id, description);
  }
}

module.exports = {
  gettingAllCourses,
  gettingCourseDetails,
  creatingCourse,
  addingPlaceInCourse,
  updatingCourseDetail
}