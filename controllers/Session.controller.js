const { validationResult } = require('express-validator');
const { createSession, updateSession, deleteSessionById,
        getSessionsByCourse, 
        checkIfSessionExistsById} = require("../services/Session.services.js");

const { checkIfCourseExistsById } = require("../services/Course.services.js");

/*-- createSessionController */
/**
 * Controller function to create a new session for a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const createSessionController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id, start_time, end_time} = req.body;

    const username = req.cookies.username;

    try {    

        const courseExists = await checkIfCourseExistsById(course_id);

        if(!courseExists){
            return res.status(400).json({message:`No course found with id: ${course_id}`})
        }

        const sessionId = await createSession(course_id, start_time, end_time, username);

        res.status(200).json({ message: 'Session created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- updateSessionController */
/**
 * Controller function to update an existing session.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const updateSessionController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { session_id } = req.params;
    const {course_id, start_time, end_time} = req.body;

    try {

        const sessionExists = await checkIfSessionExistsById(session_id);
        if(!sessionExists){
            return res.status(400).json({message: `No session found with id: ${session_id}`});
        }

        const courseExists = await checkIfCourseExistsById(course_id);
        if(!courseExists){
            return res.status(400).json({message:`No course found with id: ${course_id}`})
        }

        const result = await updateSession(session_id, course_id, start_time, end_time);
        if (result > 0) {
            res.status(200).json({ message: 'Session updated successfully' });
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- getSessionsController */
/**
 * Controller function to retrieve sessions for a specific course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the sessions or error message.
 */
const getSessionsController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.params;

    try {

        const courseExists = await checkIfCourseExistsById(course_id);
        if(!courseExists){
            return res.status(400).json({message:`No course found with id: ${course_id}`})
        }

        const sessions = await getSessionsByCourse(course_id);
        if(sessions.length === 0){
            return res.status(200).json({message:`No sessions found for this course.`})
        }

        res.status(200).json(sessions);
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- deleteSessionByIdController */
/**
 * Controller function to delete a session by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteSessionByIdController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { session_id } = req.params;

    try {
        const affectedRows = await deleteSessionById(session_id);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Session deleted successfully' });
        } else {
            res.status(404).json({ message: `Session not found with id: ${session_id}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
};

module.exports = {
    createSessionController,
    updateSessionController,
    getSessionsController,
    deleteSessionByIdController,
}
