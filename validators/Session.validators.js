const { check } = require('express-validator');

/*-- createSessionValidator */
// Validates the request body for creating a new session.
const createSessionValidator = [
];

/*-- getSessionsValidator */
// Validates the request parameters for retrieving sessions of a course.
const getSessionsValidator = [
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
];

/*-- deleteSessionByIdValidator */
// Validates the request parameters for deleting a session by its ID.
const deleteSessionByIdValidator = [
    check('session_id').notEmpty().withMessage('Session ID is required'),
    check('session_id').isInt().withMessage('Invalid session ID'),
];

module.exports = {
    createSessionValidator,
    getSessionsValidator,
    deleteSessionByIdValidator
};
