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

module.exports = {
  gettingAllCourses,
  gettingCourseDetails
}