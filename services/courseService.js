const courseDao = require("../models/courseDao");

const gettingAllCourses = async () => {
  const allCourses = await courseDao.getAllCourses();
  return { totalCourses: allCourses };
}

const gettingMyCourses = async (userId) => {
  const myCourses = await courseDao.getMyCourses(userId);
  return { myCourses: myCourses };
}

const gettingMyLikedCourses = async (userId) => {
  const myLikedCourses = await courseDao.getMyLikedCourses(userId);
  return { myLikedCourses: myLikedCourses };
}

const gettingCourseDetails = async (courseId) => {
    const courseDetail = await courseDao.getCourseById(courseId);
    const placesInCourse = await courseDao.getPlacesesByCourseId(courseId);
    return { course: courseDetail, placesInCourse: placesInCourse };
};

const gettingCoursesWithWho = async (withWhoId) => {
  const coursesWithWho = await courseDao.getCoursesByWithWhoId(withWhoId);
  return { with: withWhoId, courses: coursesWithWho };
}

const creatingCourse = async (userId, course_title, with_who_id, description) => {
  const courseId = await courseDao.createCourse(userId, course_title, with_who_id, description);

  return { createdCourseId: courseId };
}

const addingPlaceInCourse = async (userId, courseId, placeId, placeLike) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return 0;
  }else{
    await courseDao.addPlaceInCourse(courseId, placeId, placeLike);
    return 1;
  }
}

const updatingCourseDetail = async (userId, courseId, course_title, with_who_id, description) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return 0;
  }else{
    await courseDao.updateCourseDetail(courseId, course_title, with_who_id, description);
    return 1;
  }
}

const deletingCourse = async (userId, courseId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  console.log(userCheck);
  if(userCheck != 1) {
    return 0;
  }else{
    await courseDao.deleteCourse(courseId);
    return 1;
  }
}

const deletingPlaceInCourse = async (userId, courseId, placeId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  if(userCheck != 1) {
    return 0;
  }else{
    await courseDao.deletePlaceInCourse(courseId, placeId);
    return 1;
  }
}

const addingCourseLike = async (userId, courseId) => {
  const userCheck = await courseDao.userCourseCheck(userId, courseId);
  const userLikedCheck = await courseDao.userLikedCheck(userId, courseId);
  if(userCheck == 1 || userLikedCheck == 1) {
    return 0;
  }else{
    await courseDao.addCourseLike(userId, courseId);
    return 1;
  }
}

const deletingCourseLike = async (userId, courseId) => {
  const userLikedCheck = await courseDao.userLikedCheck(userId, courseId);

  if(userLikedCheck != 1) {
    return 0;
  }else{
    await courseDao.deleteCourseLike(userId, courseId);
    return 1;
  }
}


module.exports = {
  gettingAllCourses,
  gettingMyCourses,
  gettingMyLikedCourses,
  gettingCourseDetails,
  gettingCoursesWithWho,
  creatingCourse,
  addingPlaceInCourse,
  updatingCourseDetail,
  deletingCourse,
  deletingPlaceInCourse,
  addingCourseLike,
  deletingCourseLike
}