const { check } = require("express-validator");

/*-- addCommentValidator */
// Validates the request body for adding a comment to a course.
const addCommentValidator = [
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('comment').notEmpty().withMessage('Comment is required'),
    check('comment').isString().withMessage('Invalid comment'),
];

/*-- getCommentValidator */
// Validates the request parameters for retrieving comments of a course.
const getCommentValidator = [
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
];

module.exports = {
    addCommentValidator,
    getCommentValidator
}