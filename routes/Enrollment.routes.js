const express = require('express');
const router = express.Router();

// Import validators
const {
    enrollCourseValidator,
} = require("../validators/Enrollment.validators");

// Import controllers
const { 
    enrollCourseController, 
    getUserEnrollmentsController 
} = require("../controllers/Enrollment.controller");

// Define routes and their respective controllers
router.post('/enroll', enrollCourseValidator, enrollCourseController); // Route to enroll in a course
router.get('/enrollment',getUserEnrollmentsController); // Route to get user enrollments

module.exports = router;
