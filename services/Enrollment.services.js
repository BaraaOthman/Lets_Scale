const { query } = require("../database/db");
const { createSession } = require("../services/Session.services");

/**
 * Checks if a user is enrolled in any course.
 * @param {string} username - The username of the user.
 * @returns {boolean} - Returns true if the user is enrolled in any course, otherwise false.
 */
const checkIfUserEnrolled = async (username, course_id) => {
    try {
        // Retrieve user ID from username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);
        const user_id = userRows[0].user_id;

        // Retrieve session ID for the given user and course
        const sessionQuery = 'SELECT session_id FROM session WHERE user_id = ? AND course_id = ?';
        const sessionRows = await query(sessionQuery, [user_id, course_id]);
        if (sessionRows.length === 0) {
            // If no session found, user is not enrolled
            return 0;
        }

        const session_id = sessionRows[0].session_id;

        // Check if the user is enrolled in the session
        const enrollmentQuery = 'SELECT COUNT(*) AS count FROM enrollment WHERE user_id = ? AND session_id = ?';
        const enrollmentRows = await query(enrollmentQuery, [user_id, session_id]);

        // Return the count of enrollments
        return enrollmentRows[0].count > 0;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Enrolls a user in a course session.
 * @param {number} course_id - The ID of the course to enroll in.
 * @param {string} username - The username of the user to enroll.
 * @returns {Object} - Returns the result of the enrollment operation.
 */
const enrollCourse = async (course_id, username) => {
    try {
        // Retrieve user ID from username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);
        const user_id = userRows[0].user_id;

        // Create session with default start and end times
        await createSession(course_id, "09:00:00", "10:30:00", username);
    
        // Retrieve session IDs for the enrolled course
        const sessionSql = `SELECT session_id FROM session WHERE course_id = ?`;
        const sessionRows = await query(sessionSql, [course_id]);
        
        // Extract session IDs from the result
        const session_ids = sessionRows.map(row => row.session_id);
        
        // Insert enrollment records for each session
        const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current datetime
        for (const session_id of session_ids) {
            const enrollSql = `INSERT INTO enrollment (user_id, session_id, date, status) VALUES (?, ?, ?, ?)`;
            await query(enrollSql, [user_id, session_id, date, "enrolled"]);
        }

        // Return the result of the enrollment operation
        return { success: true, message: "Enrollment successful" };
    } catch (error) {
        // Handle any errors that occur during the enrollment process
        throw new Error(error);
    }
};

/**
 * Deletes an enrollment record for a specific user and course.
 * @param {number} course_id - The ID of the course.
 * @param {string} username - The username of the user.
 * @returns {Object} - Returns the result of the deletion operation.
 */
const deleteEnrollment = async (course_id, username) => {
    try {
        // Retrieve user ID from username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const [userRows] = await query(userQuery, [username]);
        const user_id = userRows[0].user_id;

        // SQL query to delete the enrollment record
        const sql = `DELETE FROM enrollment WHERE course_id = ? AND user_id = ?`;

        // Execute the query with the provided parameters
        const result = await query(sql, [course_id, user_id]);

        // Return the result of the deletion operation
        return result;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Retrieves enrollment records for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Array} - Returns an array of enrollment records for the user.
 */
const getUserEnrollments = async (username) => {
    try {
        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;

        // Step 1: Retrieve session_id from enrollment where user_id = ?
        const sessionQuery = 'SELECT session_id FROM enrollment WHERE user_id = ?';
        const sessionRows = await query(sessionQuery, [user_id]);

        // Initialize an array to store course IDs
        let courseIds = [];

        // Step 2: Retrieve course_id from session where session_id = ?
        for (let i = 0; i < sessionRows.length; i++) {
            const session_id = sessionRows[i].session_id;
            const courseQuery = 'SELECT course_id FROM session WHERE session_id = ?';
            const courseRows = await query(courseQuery, [session_id]);
            courseIds = courseIds.concat(courseRows.map(row => row.course_id));
        }

        // Step 3: Retrieve * from table course where course_id = ?
        const enrollments = [];
        for (let i = 0; i < courseIds.length; i++) {
            const courseQuery = 'SELECT * FROM course WHERE course_id = ?';
            const courseRows = await query(courseQuery, [courseIds[i]]);
            enrollments.push(...courseRows);
        }

        // Return the array of enrolled courses
        return enrollments;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};


module.exports = {
    enrollCourse,
    deleteEnrollment,
    checkIfUserEnrolled,
    getUserEnrollments,
};
