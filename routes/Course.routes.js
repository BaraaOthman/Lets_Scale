const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import controllers and validators
const { 
    addCourseController, 
    searchCourseByNameController, 
    getAllCoursesController, 
    updateCourseController, 
    deleteCourseController, 
    withdrawCourseController 
} = require("../controllers/Course.controller");

const {  
    withdrawCourseValidator, 
    searchCourseByNameValidator 
} = require('../validators/Course.validators');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
        cb(null, './public/uploads') // Uploads will be stored in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname) // File will be named with current timestamp + original filename
    }
});

// Initialize multer
const upload = multer({storage });

// Define routes and their respective controllers and validators
router.post('/addCourse', upload.single('image'), addCourseController); // Route to add a new course
router.get('/course', getAllCoursesController); // Route to get all courses
router.post('/updateCourse', upload.fields([{ name: 'image' }, { name: 'video'}]), updateCourseController);// Route to update course 
router.post('/delete/', withdrawCourseValidator, deleteCourseController); // Route to delete a course by ID
router.post('/withdraw', withdrawCourseValidator, withdrawCourseController); // Route to withdraw from a course
router.get('/search/', searchCourseByNameValidator, searchCourseByNameController); // Route to search courses by name

module.exports = router;
