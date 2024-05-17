const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/all', loginRequired, courseController.getAllCourses);
router.get('/:courseId', loginRequired, courseController.getCourseDetails);
router.post('/', loginRequired, courseController.createCourse);
//router.patch('/:courseId', courseController.updateCourse);

module.exports = { router };