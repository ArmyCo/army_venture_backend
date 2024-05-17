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
    const result = await appDataSource.query(
      `
      INSERT INTO user_courses (user_id, course_title, with_who_id, description) 
      VALUES (?, ?, ?, ?)
      `,
      [userId, course_title, with_who_id, description]
    )
    return result.insertId;;
}

const addPlaceInCourse = async (courseId, placeId, placeLike) => {
    const result = await appDataSource.query(
      `
      INSERT INTO places_in_user_courses (user_courses_id, place_id, place_like) 
      VALUES (?, ?, ?)
      `,
      [courseId, placeId, placeLike]
    )
    return result.insertId;
}

const userCourseCheck = async (userId, courseId) => {
    await appDataSource.query(
      `
      SELECT course_title
      FROM user_courses
      WHERE user_id = ? AND id = ?
      `,
      [userId, courseId]
    )
    return 1;
}

const updateCourseDetail = async (courseId, course_title, with_who_id, description) => {
     await appDataSource.query(
      `
      UPDATE user_courses
      SET course_title = ?, with_who_id = ?, description = ?
      WHERE id = ?
      `,
      [course_title, with_who_id, description, courseId]
    )
}

const deleteCourse = async (courseId) => {
    await appDataSource.query(
      `
      DELETE FROM user_courses
      WHERE id = ?
      `,
      [courseId]
    )
}

const deletePlaceInCourse = async (courseId, placeId) => {
    await appDataSource.query(
      `
      DELETE FROM places_in_user_courses
      WHERE user_courses_id = ? AND place_id = ?
      `,
      [courseId, placeId]
    )
}

module.exports = {
    getAllCourses,
    getCourseById,
    getPlacesesByCourseId,
    createCourse,
    addPlaceInCourse,
    userCourseCheck,
    updateCourseDetail,
    deleteCourse,
    deletePlaceInCourse
}