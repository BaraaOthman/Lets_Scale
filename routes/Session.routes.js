const express = require('express');
const router = express.Router();

// Import controllers
const { 
    createSessionController, 
    updateSessionController, 
    getSessionsController, 
    deleteSessionByIdController 
} = require("../controllers/Session.controller");

// Import validators
const { 
    createSessionValidator, 
    getSessionsValidator, 
    deleteSessionByIdValidator 
} = require('../validators/Session.validators');

// Define routes and their respective controllers
router.post('/session', createSessionValidator, createSessionController); // Route to create a session for a course
router.put('/:session_id', createSessionValidator, updateSessionController); // Route to update a session
router.get('/:course_id', getSessionsValidator, getSessionsController); // Route to get sessions for a course
router.delete('/:session_id', deleteSessionByIdValidator, deleteSessionByIdController); // Route to delete a session by ID

module.exports = router;
