const { query } = require("../database/db");

/**
 * Inserts a new comment into the comment table if it doesn't already exist.
 * @param {string} username - The username of the user adding the comment.
 * @param {number} course_id - The ID of the course for which the comment is added.
 * @param {string} comment - The text of the comment.
 * @returns {Object} - Result of the insertion operation.
 */
const addComment = async (username, course_id, comment) => {
    try {
        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
           throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;

        // Construct SQL query to insert the comment
        const commentSql = `INSERT INTO comment (user_id, course_id, comment) VALUES (?, ?, ?)`;
        const values = [user_id, course_id, comment];

        // Execute the SQL query
        const commentResult = await query(commentSql, values);

        // Return the result of the insertion operation
        return commentResult;

    } catch (error) {
        // Throw any errors that occur during execution
        throw new Error(error);
    }
}

/**
 * Checks if a comment exists for a given user and course ID.
 * @param {number} user_id - The ID of the user.
 * @param {number} course_id - The ID of the course.
 * @returns {boolean} - Returns true if a comment exists for the user and course, otherwise false.
 */
const checkCommentIfExistsById = async (user_id, course_id) => {
    try {
        // SQL query to check if a comment exists for the given user and course ID
        const sql = `SELECT * FROM comment WHERE user_id = ? AND course_id = ?`;

        // Values to be passed as parameters to the SQL query
        const values = [user_id, course_id];

        // Execute the SQL query
        const result = await query(sql, values);

        // Return true if a comment exists, otherwise false
        return result.length > 0;

    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
}

/**
 * Retrieves comments for a specific course.
 * @param {number} course_id - The ID of the course to retrieve comments for.
 * @returns {Array} - An array containing the comments for the specified course.
 */
const getComments = async (course_id) => {
    try {
        // SQL query to retrieve comments for the specified course
        const commentsSql = `SELECT * FROM comment WHERE course_id = ?`;

        // Execute the SQL query
        const comments = await query(commentsSql, [course_id]);

        // Return the array of comments
        return comments;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
}

/**
 * Deletes a comment with the specified ID.
 * @param {number} comment_id - The ID of the comment to delete.
 * @param {number} user_id - The ID of the user who posted the comment.
 * @param {number} course_id - The ID of the course associated with the comment.
 * @returns {boolean} - Returns true if the comment was successfully deleted, otherwise false.
 */
const deleteComment = async (comment_id, username, course_id) => {
    try {

        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
           throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;
        // Check if the comment exists before deleting
        const commentExists = checkCommentIfExistsById(user_id, course_id);
        if (!commentExists) {
            return false;
        }

        // SQL query to delete the comment with the specified ID
        let deleteSql = `DELETE FROM comment WHERE comment_id = ?`;

        // Execute the SQL query
        const comment = await query(deleteSql, [comment_id]);

        // Return true if the comment was successfully deleted
        return comment.affectedRows > 0;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
}

module.exports = {
    addComment,
    getComments,
    deleteComment,
    checkCommentIfExistsById
}
