const express = require('express');
const router = express.Router();

// Import controllers
const { 
   getMyCoursesController
} = require("../controllers/me.controller");

// Define routes and their respective controllers
router.get('/myCourse',getMyCoursesController);  // Route to get user courses

module.exports = router;
