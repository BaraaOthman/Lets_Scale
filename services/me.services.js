const { query } = require("../database/db");

/**
 * Retrieves courses records for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Array} - Returns an array of courses records for the user.
 */
const getMyCourses = async (username) => {
    try {
        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;

        // Step 1: Retrieve session_id from enrollment where user_id = ?
        const courseQuery = 'SELECT * FROM course WHERE user_id = ?';
        const courseRows = await query(courseQuery, [user_id]);

         // Return the array of enrolled courses
        return courseRows;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};


module.exports = {
    getMyCourses,
};
