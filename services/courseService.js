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

const addingPlaceInCourse = async (courseId, placeId) => {
  const result = await courseDao.addPlaceInCourse(courseId, placeId);

  return result;
}

module.exports = {
  gettingAllCourses,
  gettingCourseDetails,
  creatingCourse,
  addingPlaceInCourse
}