const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up multer storage for uploading videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads') // Videos will be stored in the 'public/videos' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // File will be named with its original filename
    }
});

// Initialize multer
const upload = multer({ storage });

// Import controllers
const { 
    uploadVideoController, 
    deleteVideoController, 
    getVideoByIdController, 
    getVideoByCourseIdController
} = require('../controllers/Video.controller');

// Import validators
const { uploadVideoValidator, deleteVideoValidator } = require('../validators/Video.validators');

// Define routes and their respective controllers
router.post('/upload', upload.single('video'), uploadVideoValidator, uploadVideoController); // Route to upload a video
router.get('/:video_id', deleteVideoValidator, getVideoByIdController); // Route to get video by ID
router.delete('/:video_id', deleteVideoValidator, deleteVideoController); // Route to delete video by ID
router.get('/video/:course_id', getVideoByCourseIdController);// Route to get video by course ID


module.exports = router;
