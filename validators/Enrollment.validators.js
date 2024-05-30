const { check } = require('express-validator');

/*-- enrollCourseValidator */
// Validates the request body for enrolling in a course.
const enrollCourseValidator = [
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('username').isEmpty().withMessage("Username is required"),
];

module.exports = {
    enrollCourseValidator,
};
