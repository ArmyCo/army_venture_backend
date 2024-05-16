const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/all', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseDetails);
//router.post('/', courseController.createCourse);
//router.patch('/:courseId', courseController.updateCourse);

module.exports = { router };