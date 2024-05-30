const { query } = require("../database/db");

/**
 * Retrieves video information by its ID.
 * @param {number} video_id - The ID of the video to retrieve.
 * @returns {object} - Returns an object containing video information if found, otherwise returns a message.
 */
const getVideoById = async (video_id) => {
    try {
        
        // Retrieve video information from the database
        let videoSql = `SELECT * FROM video WHERE video_id = ?`;
        const video = await query(videoSql, [video_id]);
        return video[0];

    } catch (error) {
        // Throw an error if there's any issue during the retrieval process
        throw new Error(error);
    }
};

/**
 * Checks if a video exists in the database by its ID.
 * @param {number} video_id - The ID of the video to check.
 * @returns {boolean} - Returns true if a video with the provided ID exists, otherwise returns false.
 */
const checkIfVideoExistsByID = async (video_id) => {
    try {
        // Query the database to count the number of videos with the provided ID
        let sql = `SELECT COUNT(*) as count FROM video WHERE video_id = ?`;
        const result = await query(sql, [video_id]);
        // Return true if the count is greater than 0, indicating the video exists
        return result[0].count > 0;
    } catch (error) {
        // Throw an error if there's any issue during the database query
        throw new Error(error);
    }
};

/**
 * Retrieves the URL of the video associated with a course by its ID.
 * @param {number} course_id - The ID of the course.
 * @returns {Promise<string>} - A promise that resolves to the URL of the video.
 * @throws {Error} - If there's an issue with the database query or no video is found for the course.
 */
const getVideoByCourseId = async (course_id) => {
    try {
        let videoSql = `SELECT video_id FROM course WHERE course_id = ?`;
        const videoResult = await query(videoSql, [course_id]);

        // Check if videoResult is empty
        if (videoResult.length === 0) {
            throw new Error(`No video found for course with ID ${course_id}`);
        }

        // Retrieve the video ID from the result
        const video_id = videoResult[0].video_id;

         // SQL query to select the URL of the video based on its ID
        let pathSql = `SELECT URL FROM video WHERE video_id = ?`;
        const pathResult = await query(pathSql, [video_id]);

        // Return the URL of the video
        return pathResult[0].URL;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Uploads a video to the database.
 * @param {string} username - The username of the user uploading the video.
 * @param {number} course_id - The ID of the course associated with the video.
 * @param {string} title - The title of the video.
 * @param {string} URL - The URL of the video.
 * @param {string} duration - The duration of the video in HH:MM:SS format.
 * @returns {object} - Returns an object containing information about the uploaded video.
 */
const uploadVideo = async (username, title, URL, duration, description, upload_date) => {
    try {
        // Retrieve user_id for the given username
        const userQuery = 'SELECT user_id FROM users WHERE username = ?';
        const userRows = await query(userQuery, [username]);

        if (!userRows || userRows.length === 0) {
            throw new Error('User not found');
        }

        const user_id = userRows[0].user_id;
        
        // Retrieve session_id based on user_id
        const sessionQuery = 'SELECT session_id FROM session WHERE user_id = ?';
        const sessionRows = await query(sessionQuery, [user_id]);

        if (!sessionRows || sessionRows.length === 0) {
            throw new Error('Session not found'); 
        }

        const session_id = sessionRows[0].session_id;

        // Insert the video information into the database
        const uploadSql = `INSERT INTO video (session_id, title, URL, duration, description, upload_date) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
                            
        const uploadedVideo = await query(uploadSql, [session_id, title, URL, duration, description,
                                            upload_date]);
        
        return uploadedVideo;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Deletes a video from the database.
 * @param {number} video_id - The ID of the video to be deleted.
 * @returns {boolean} - Returns true if the video is successfully deleted, otherwise returns false.
 */
const deleteVideo = async (video_id) => {
    try {
        // Delete the video from the database
        let deleteSql = `DELETE FROM video WHERE video_id = ?`;
        const deletedVideo = await query(deleteSql, [video_id]);

        // Check if the video is successfully deleted
        return deletedVideo.affectedRows > 0;
    } catch (error) {
        // Throw an error if there's any issue during the database query
        throw new Error(error);
    }
}

module.exports = {
    getVideoById,
    uploadVideo,
    deleteVideo,
    getVideoByCourseId,
    checkIfVideoExistsByID
};
