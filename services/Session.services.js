const { query } = require("../database/db");

/**
 * Creates a new session for a specified course.
 * @param {number} course_id - The ID of the course for which the session is created.
 * @returns {number} - Returns the ID of the newly created session.
 */
const createSession = async (course_id, start_time, end_time, username) => {
    try {

        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
           throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;

        // SQL query to insert a new session into the database
        const sessionSql = 'INSERT INTO session (course_id, start_time, end_time, user_id) VALUES (?, ?, ?, ?)';

        // Execute the query and get the ID of the newly created session
        const addedSession = await query(sessionSql,[course_id, start_time, end_time, user_id]);

        // Return the ID of the newly created session
        return addedSession.insertId;

    } catch (error) {
        // Throw an error if there's an issue with the database query or if the course_id does not exist
        throw new Error(error);
    }
};


/**
 * Updates the expiration time of a session.
 * @param {number} session_id - The ID of the session to be updated.
 * @param {string} expirationTime - The new expiration time for the session.
 * @returns {number} - Returns the number of affected rows in the database.
 */
const updateSession = async (session_id, course_id, start_time, end_time) => {
    try {
        
        // SQL query to update the expirationTime of the session
        const updateSql = `UPDATE session SET course_id = ?, start_time = ?, end_time = ?
                            WHERE session_id = ?`;

        // Execute the query and get the number of affected rows
        const updatedSession = await query(updateSql,[course_id, start_time, end_time, session_id]);
        
        // Return the number of affected rows
        return updatedSession.affectedRows;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};


/**
 * Checks if a session exists in the database based on its ID.
 * @param {number} session_id - The ID of the session to check for existence.
 * @returns {boolean} - Returns true if the session exists, otherwise returns false.
 */
const checkIfSessionExistsById = async (session_id) => {
    try {
        // SQL query to count the number of sessions with the given ID
        const sql = `SELECT COUNT(*) AS count FROM session WHERE session_id = ?`;

        // Execute the query and get the count
        const result = await query(sql, [session_id]);

        // Return true if count is greater than 0, indicating session exists
        return result[0].count > 0;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};


/**
 * Retrieves sessions associated with a given course from the database.
 * @param {number} course_id - The ID of the course for which sessions are to be retrieved.
 * @returns {Array} - An array containing the sessions associated with the course.
 */
const getSessionsByCourse = async (course_id) => {
    try {
        // SQL query to retrieve sessions for a given course
        const sessionsSql = 'SELECT * FROM session WHERE course_id = ?';

        // Execute the query to fetch sessions
        const sessions = await query(sessionsSql, [course_id]);

        // Return the array of sessions
        return sessions;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Deletes a session from the database by its ID.
 * @param {number} session_id - The ID of the session to be deleted.
 * @returns {number} - The number of affected rows.
 */
const deleteSessionById = async (session_id) => {
    try {
        // SQL query to delete a session by its ID
        const deleteSql = 'DELETE FROM session WHERE session_id = ?';

        // Execute the query to delete the session
        const deletedSession = await query(deleteSql, [session_id]);

        // Return the number of affected rows
        return deletedSession.affectedRows;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

module.exports = {
    createSession,
    updateSession,
    getSessionsByCourse,
    checkIfSessionExistsById,
    deleteSessionById,
};
