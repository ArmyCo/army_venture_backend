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



module.exports = {
    getAllCourses,
    getCourseById,
    getPlacesesByCourseId
}