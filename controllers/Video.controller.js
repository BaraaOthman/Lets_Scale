const { validationResult } = require('express-validator');
const { uploadVideo, deleteVideo, getVideoById, getVideoByCourseId } = require("../services/Video.services");
const {checkIfVideoExistsByID} = require("../services/Video.services");
const { getComments } = require('../services/Comment.services');
const { getCourseNameById } = require('../services/Course.services');
const {getuseridfromusername } = require('../services/User.services');

/*-- getVideoByIdController */
/**
 * Controller function to retrieve a video by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the video data or error message.
 */
const getVideoByIdController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { video_id } = req.params;

    try {
        // Check if the video exists by its ID
        const videoExists = await checkIfVideoExistsByID(video_id);
        if (!videoExists) {
            return res.status(400).json({message:`No video found with ID : ${video_id}`})
        }
        const result = await getVideoById(video_id);

        if (!result) {
            return res.status(200).json({ message: "Video not found" });
        }

        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

/*-- uploadVideoController */
/**
 * Controller function to upload a video.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const uploadVideoController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    try {

        const {  
                title,
                duration,
                description,
                upload_date } = req.body;

        const username = req.cookies.username;
    
        const result = await uploadVideo(username,title, req.file.filename, duration, description, 
            upload_date);

        res.status(200).json({ message: 'File uploaded and video data saved successfully!' });
            
    } catch (error) {
        res.status(500).json({ message: 'You need to login!' });
    }
};

/*--  getVideoByCourseIdController */
/**
 * Controller function to get a video by course_id.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const getVideoByCourseIdController = async (req, res) => {
    const { course_id } = req.params;
    const username = req.cookies.username;

    try { 
        const videoPath = await getVideoByCourseId(course_id);
        const comments = await getComments(course_id);
        const [courseName, description] = await getCourseNameById(course_id);
        const user_id = await getuseridfromusername(username);
    
        res.render('video', { path:  videoPath, course_id: course_id ,comments: comments, courseName: courseName,
        userid: user_id, description: description});

    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/*-- deleteVideoController */
/**
 * Controller function to delete a video by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteVideoController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    const { video_id } = req.params;
    try {

        const videoExists = await checkIfVideoExistsByID(video_id)
        if(!videoExists){
            return res.status(400).json({message:`No video found with ID : ${video_id}`})
        }
        const result = await deleteVideo(video_id);
        if (!result) {
            return res.status(200).json({ message: "Video can not be deleted" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = {
    getVideoByIdController,
    uploadVideoController,
    deleteVideoController,
    getVideoByCourseIdController
};
