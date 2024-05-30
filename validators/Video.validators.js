const { check } = require('express-validator');

/*-- playVideoValidator */
// Validates the request body for playing a video.
const playVideoValidator = [
    check('video_id').notEmpty().withMessage('Video ID is required'),
    check('video_id').isInt().withMessage('Invalid video ID'),
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
    check('title').notEmpty().withMessage('Title is required'),
    check('title').isString().withMessage('Invalid title'),check('URL').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Video link is required');
        }
        return true;
    }),
    check('duration').notEmpty().withMessage('Duration is required'),
    check('duration').isString().withMessage('Invalid duration'),
];

/*-- uploadVideoValidator */
// Validates the request body for uploading a video.
const uploadVideoValidator = [
    check('title').notEmpty().withMessage('Title is required'),
    check('title').isString().withMessage('Invalid title'),
    check('URL').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Video link is required');
        }
        return true;
    }),
    check('duration').notEmpty().withMessage('Duration is required'),
    check('duration').isString().withMessage('Invalid duration'),
    //check('description').isEmpty().withMessage('Description is required'),
    //check('description').isString().withMessage('Invalid description'),
    //check('upload_date').isEmpty().withMessage('Date is required'),
    //check('upload_date').isDate().withMessage('Invalid Date'),
];

/*-- deleteVideoValidator */
// Validates the request body for deleting a video.
const deleteVideoValidator = [
    check('video_id').notEmpty().withMessage('Video ID is required'),
    check('video_id').isInt().withMessage('Invalid video ID'),
];

module.exports = {
    playVideoValidator,
    uploadVideoValidator,
    deleteVideoValidator,
};
