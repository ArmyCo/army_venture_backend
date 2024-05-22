const { appDataSource } = require("./data-source.js");

const getAllCourses = async () => {
    const allCourses = await appDataSource.query(
      `
      SELECT * FROM user_courses
      `
    )
    return allCourses;
};

const getMyCourses = async (userId) => {
    const myCourses = await appDataSource.query(
      `
      SELECT * FROM user_courses
      WHERE user_id = ?
      `,
      [userId]
    )
    return myCourses;
}

const getMyLikedCourses = async (userId) => {
    const myLikedCourses = await appDataSource.query(
      `
      SELECT * 
      FROM user_courses uc
      INNER JOIN course_likes cl ON uc.id = cl.course_id
      WHERE cl.user_id = ?
      `,
      [userId]
    )
    return myLikedCourses;
}

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

const getCoursesByWithWhoId = async (withWhoId) => {
    const coursesWithWho = await appDataSource.query(
      `
      SELECT * FROM user_courses
      WHERE with_who_id = ?
      ORDER BY likes DESC
      `,
      [withWhoId]
    )
    return coursesWithWho;
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
    const [checkOwner] = await appDataSource.query(
      `
      SELECT course_title
      FROM user_courses
      WHERE user_id = ? AND id = ?
      `,
      [userId, courseId]
    )

    if (!checkOwner){
      return 0;
    }
    return 1;
}

const userLikedCheck = async (userId, courseId) => {
    const [checkLiked] = await appDataSource.query(
      `
      SELECT created_at
      FROM course_likes
      WHERE user_id = ? AND course_id = ?
      `,
      [userId, courseId]
    )

    if (!checkLiked){
      return 0;
    }
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

const addCourseLike = async (userId, courseId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try{
    await queryRunner.query(
      `
      UPDATE user_courses
      SET likes = likes + 1
      WHERE id = ?
      `,
      [courseId]
    );

    await queryRunner.query(
      `
      INSERT INTO course_likes (user_id, course_id) 
      VALUES (?, ?)
      `,
      [userId, courseId]
    );
    await queryRunner.commitTransaction();
  } catch(err){
    await queryRunner.rollbackTransaction();
    err.statusCode = 500;
    throw err;
  } finally {
    await queryRunner.release();
  }
}

const deleteCourseLike = async (userId, courseId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try{
    await queryRunner.query(
      `
      UPDATE user_courses
      SET likes = likes - 1
      WHERE id = ?
      `,
      [courseId]
    );

    await queryRunner.query(
      `
      DELETE FROM course_likes
      WHERE user_id = ? AND course_id = ?
      `,
      [userId, courseId]
    );
    await queryRunner.commitTransaction();
  } catch(err){
    await queryRunner.rollbackTransaction();
    err.statusCode = 500;
    throw err;
  } finally {
    await queryRunner.release();
  }
}


module.exports = {
    getAllCourses,
    getMyCourses,
    getMyLikedCourses,
    getCourseById,
    getPlacesesByCourseId,
    getCoursesByWithWhoId,
    createCourse,
    addPlaceInCourse,
    userCourseCheck,
    userLikedCheck,
    updateCourseDetail,
    deleteCourse,
    deletePlaceInCourse,
    addCourseLike,
    deleteCourseLike
}