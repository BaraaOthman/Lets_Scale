const { query } = require("../database/db");

/**
 * Adds a new course to the course table.
 * @param {string} name - The name of the course.
 * @param {string} description - The description of the course.
 * @param {string} instructor - The instructor of the course.
 * @param {string} image - The image URL of the course.
 *  @param {string} username - The username of the user.
 * @returns {Object} - The newly added course object.
 */
const addCourse = async (name, description, image, username) => {
    try {
        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found');
        }

        const user_id = userRows[0].user_id;

        // 1. Insert a new video into the video table
        const videoSql = 'INSERT INTO video ( URL) VALUES (?)';
        const videoResult = await query(videoSql, ['']); // Adjust URL as needed

        // 2. Retrieve the video_id of the newly inserted video
        const video_id = videoResult.insertId;

        // 3. Insert a new course into the course table, using the retrieved video_id
        const courseSql = `
            INSERT INTO course (name, description, instructor, image, user_id, video_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const result = await query(courseSql, [name, description, username, image, user_id, video_id]);

        // Retrieve the newly added course from the database
        const addedCourse = await query('SELECT * FROM course WHERE course_id = ?', [result.insertId]);

        // Return the newly added course object
        return addedCourse[0];
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Checks if a course exists in the course table by its ID.
 * @param {number} course_id - The ID of the course to check.
 * @returns {boolean} - True if the course exists, false otherwise.
 */
const checkIfCourseExistsById = async (course_id) => {
    try {
        // SQL query to count the number of courses with the provided course_id
        const result = await query(`SELECT COUNT(*) AS count FROM course WHERE course_id = ?`, [course_id]);

        // Retrieve the count of courses
        const count = result[0].count;

        // Return true if the count is greater than 0, indicating that the course exists
        return count > 0;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Updates a course in the course table with the provided information.
 * @param {number} course_id - The ID of the course to update.
 * @param {string} name - The new name of the course.
 * @param {string} description - The new description of the course.
 * @param {string} instructor - The new instructor of the course.
 * @param {string} image - The new image URL of the course.
 * @returns {object} - The result of the database update operation.
 */
const updateCourse = async (course_id, name, description, image, video) => {
    try {
        // Check if the course exists by ID
        const courseExists = await checkIfCourseExistsById(course_id);
        if (!courseExists) {
            return { message: `Course with ID ${course_id} not found` };
        }

        // Retrieve the existing video ID for the course
        const videoSql = `SELECT video_id FROM course WHERE course_id = ?`;
        const videoResult = await query(videoSql, [course_id]);
        const video_id = videoResult[0].video_id;

        // Update the video path for the course
        const updateVideoSql = `UPDATE video SET URL = ? WHERE video_id = ?`;
        await query(updateVideoSql, [video, video_id]);

        const oldimage = await query(`SELECT image FROM course WHERE course_id = ?`, [course_id])
        // Update the course details
        const updateSql = `UPDATE course SET name = ?, description = ?, image = ? , 
        video_id=?  WHERE course_id = ?`;
        const values = [name, description, image, video_id, course_id];
        const updatedCourse = await query(updateSql, values);

        // Return the updated course
        return [updatedCourse, oldimage];
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Retrieves a course from the course table based on the provided course ID.
 * @param {number} course_id - The ID of the course to retrieve.
 * @returns {object} - The course retrieved from the database.
 */
const getCourseById = async (course_id) => {
    try {
        // Check if the course exists by ID
        const courseExists = await checkIfCourseExistsById(course_id);
        if (!courseExists) {
            return { message: 'Course does not exist for this ID' };
        }

        // SQL query to select the course by ID
        const courseSql = 'SELECT * FROM course WHERE course_id = ?';

        // Execute the query
        const course = await query(courseSql, [course_id]);

        // Return the retrieved course
        return course;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Retrieves the name and description of a course by its ID.
 * @param {number} course_id - The ID of the course.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the course name and description.
 * @throws {Error} - If there's an issue with the database query.
 */
const getCourseNameById = async (course_id) => {
    try {
        // Check if the course exists by ID
        const courseExists = await checkIfCourseExistsById(course_id);
        if (!courseExists) {
            return { message: 'Course does not exist for this ID' };
        }
        // SQL query to select the course by ID
        const courseSql = 'SELECT name, description FROM course WHERE course_id = ?';

        // Execute the query
        const [courseRow] = await query(courseSql, [course_id]);

        const courseName = courseRow.name;
        const description = courseRow.description
        // Return the retrieved course
        return [courseName, description];
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Deletes a course from the course table based on the provided course ID.
 * @param {number} course_id - The ID of the course to delete.
 * @returns {object} - The result of the deletion operation.
 */
const deleteCourse = async (course_id) => {
    try {
        // SQL query to delete comments related to the course
        let deleteCommentsSql = `DELETE FROM comment WHERE course_id = ?`;

        // Execute the query to delete comments
        await query(deleteCommentsSql, [course_id]);

        // SQL query to delete the course by ID
        let deleteSql = `DELETE FROM course WHERE course_id = ?`;

        // Execute the query
        await query(deleteSql, [course_id]);

        // Return the result of the deletion operation
        return { message: "Course deleted successfully" };
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Withdraws a user from a course by deleting their enrollment records.
 * @param {string} username - The username of the user withdrawing from the course.
 * @param {number} course_id - The ID of the course from which the user is withdrawing.
 * @returns {number} - The number of enrollment records deleted if successful, otherwise false.
 */
const withdrawCourse = async (username, course_id) => {
    try {
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found'); // Handle if user does not exist
        }

        const user_id = userRows[0].user_id;

        // Query to retrieve session_ids related to the course for the specific user
        const retrieveSessionIds = `SELECT e.session_id 
        FROM enrollment e 
        JOIN session s ON e.session_id = s.session_id
        WHERE s.course_id = ? 
        AND e.user_id = ?`;
        const sessionRows = await query(retrieveSessionIds, [course_id, user_id]);

        if (!sessionRows || !sessionRows.length) {
            throw new Error('No sessions found for this user and course'); // Handle if no sessions found
        }

        // Track the number of deletions
        let affectedRows = 0;

        // Loop through all session IDs and delete related enrollments and sessions
        for (const session of sessionRows) {
            const session_id = session.session_id;

            // Delete enrollment records for the user in the session
            const deleteEnrollmentSql = `DELETE FROM enrollment WHERE session_id = ? AND user_id = ?`;
            const deleteEnrollmentResult = await query(deleteEnrollmentSql, [session_id, user_id]);
            affectedRows += deleteEnrollmentResult.affectedRows;

            // Delete the session itself
            const deleteSessionSql = `DELETE FROM session WHERE session_id = ?`;
            const deleteSessionResult = await query(deleteSessionSql, [session_id]);
            affectedRows += deleteSessionResult.affectedRows;
        }

        // Return true if any rows were affected
        return affectedRows > 0;

    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Retrieves all courses from the database.
 * @returns {Array} - An array of course objects.
 */
const getAllCourses = async () => {
    try {
        // SQL query to select all courses
        const coursesSql = 'SELECT * FROM course';

        // Execute the query to fetch all courses
        const courses = await query(coursesSql);

        // Return the array of courses
        return courses;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Searches for courses by name.
 * @param {string} name - The name of the course to search for.
 * @returns {Array} - An array of course objects matching the search criteria.
 */
const searchCourseByName = async (name) => {
    try {
        // SQL query to search for courses by name
        const searchSql = `SELECT * FROM course WHERE name LIKE ?`;

        // Execute the query with the provided name
        const courses = await query(searchSql, [`%${name}%`]);

        // Return the array of courses found, or an empty array if no courses match the search criteria
        return courses;

    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

module.exports = {
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    withdrawCourse,
    checkIfCourseExistsById,
    searchCourseByName,
    getAllCourses,
    getCourseNameById
}
