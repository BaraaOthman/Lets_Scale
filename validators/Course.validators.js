const { check } = require('express-validator');

/*-- addCourseValidator */
// Validates the request body for adding a new course.
const addCourseValidator = [
    check('name').notEmpty().withMessage("Name is required"),
    check('name').isString().withMessage("Invalid name"),
    check('description').notEmpty().withMessage("Description is required"),
    check('description').isString().withMessage("Invalid description"),
    check('instructor').notEmpty().withMessage("Instructor is required"),
    check('instructor').isString().withMessage("Invalid instructor"),
];

/*-- getCourseByIdValidator */
// Validates the request parameters for retrieving a course by its ID.
const getCourseByIdValidator = [
    check('course_id').notEmpty().withMessage("Course ID is required"),
    check('course_id').isInt().withMessage("Invalid course ID"),
];

/*-- withdrawCourseValidator */
// Validates the request body for withdrawing from a course.
const withdrawCourseValidator = [
];

/*-- searchCourseByNameValidator */
// Validates the request body for searching courses by name.
const searchCourseByNameValidator = [
    check('name').notEmpty().withMessage("Name is required"),
    check('name').isString().withMessage("Invalid name"),
];

module.exports = {
    addCourseValidator,
    getCourseByIdValidator,
    withdrawCourseValidator,
    searchCourseByNameValidator
};
