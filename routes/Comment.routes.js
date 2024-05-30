const express = require('express');

// Import controllers and validators
const { addCommentController, deleteCommentController, getCommentsController } = require('../controllers/Comment.controller');
const { addCommentValidator, getCommentValidator } = require('../validators/Comment.validators');

// Create a router instance
const router = express.Router();

// Define routes and their respective controllers and validators
router.post("/addComment", addCommentValidator, addCommentController); // Route to add a new comment
router.get("/comment", getCommentValidator, getCommentsController); // Route to get comments for a course
router.post("/deleteComment/", getCommentValidator, deleteCommentController); // Route to delete a comment

module.exports = router;
