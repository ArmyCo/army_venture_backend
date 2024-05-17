const { appDataSource } = require("./data-source.js");

const getAllCourses = async () => {
    const allCourses = await appDataSource.query(
      `
      SELECT * FROM user_courses
      `
    )
    console.log(allCourses);
    return allCourses;
};

const getCourseById = async (courseId) => {
    const courseDetail = await appDataSource.query(
      `
      SELECT * FROM user_courses
      WHERE id = ?
      `,
      [courseId]
    )
    return courseDetail;
};

const getPlacesesByCourseId = async (courseId) => {
    const places = await appDataSource.query(
      `
      SELECT * 
      FROM places p
      INNER JOIN places_in_user_courses pc ON p.id = pc.place_id
      WHERE pc.user_courses_id = ?
      `,
      [courseId]
    )
    return places;
}

const createCourse = async (userId, course_title, with_who_id, description) => {
    const courseId = await appDataSource.query(
      `
      INSERT INTO user_courses (user_id, course_title, with_who_id, description) 
      VALUES (?, ?, ?, ?)
      `,
      [userId, course_title, with_who_id, description]
    )
    return courseId.insertId;;
}

const addPlaceInCourse = async (courseId, placeId) => {
    const result = await appDataSource.query(
      `
      INSERT INTO places_in_user_courses (user_courses_id, place_id) 
      VALUES (?, ?)
      `,
      [courseId, placeId]
    )
    return result;
}

module.exports = {
    getAllCourses,
    getCourseById,
    getPlacesesByCourseId,
    createCourse,
    addPlaceInCourse
}