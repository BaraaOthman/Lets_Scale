const { validationResult } = require('express-validator');
const { addCourse, updateCourse, getCourseById, deleteCourse,
    withdrawCourse, searchCourseByName, getUserCourses,
    getAllCourses,
    checkIfCourseExistsById } = require("../services/Course.services");

/*-- addCourseController */
/**
 * Controller function to add a new course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const addCourseController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const {
        name,
        description,
        image = req.file.filename
    } = req.body;

    const username = req.cookies.username;

    try {
        const result = await addCourse(name, description, image, username);
        if (!result || result.length === 0) {
            return res.status(200).json({ success: false, message: "Course can not added" })
        }
        return res.status(200).json({ success: true, message: "Course added successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "You need to login!" });
    }
}

/*-- getAllCoursesController */
/**
 * Controller function to get all courses.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing all courses or error message.
 */
const getAllCoursesController = async (req, res) => {
    try {

        const username = req.cookies.username;

        const courses = await getAllCourses();

        //res.status(200).json({courses});
        res.render('course', { courses, username: username })
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*-- updateCourseController */
/**
 * Controller function to update a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const updateCourseController = async (req, res) => {
    const { name, description } = req.body;

    let image = req.files['image'][0].filename;
    // let image = req.body.image; // Get the existing image 

    let video = req.files['video'][0].filename;
    const course_id = req.body.course_id;

    try {
        // Call the updateCourse function to update course details
        const [result, results] = await updateCourse(course_id, name, description, image, video);

        const fs = require('fs');
        const path = require('path');
        // Construct paths for old and new image files
        const oldImagePath = path.join(__dirname, '../public/uploads', results[0].image);

        const newImagePath = path.join(__dirname, '../public/uploads', image);
        // Remove the old image file if it exists
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        fs.renameSync(req.files['image'][0].path, newImagePath);

        // Respond with success message
        res.status(200).json({ success: true, message: 'Course updated successfully' });

    } catch (error) {
        // Handle errors and respond with appropriate error message
        res.status(500).json({ success: false, message: 'Interal Server Error' });
    }
};

/*-- getCourseByIdController */
/**
 * Controller function to get a course by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the course or error message.
 */
const getCourseByIdController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.params;

    try {

        const course = await getCourseById(course_id);
        if (!course || course.length === 0) {
            return res.status(200).json({ message: "course not found" });
        }

        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
};

/*-- getCourseNameByIdController */
/**
 * Controller function to retrieve the name of a course by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the course name or error message.
 */
const getCourseNameByIdController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.body;

    try {
        const courseName = await getCourseNameById(course_id);
        if (!courseName || courseName.length === 0) {
            return res.status(200).json({ message: "course not found" });
        }

        res.status(200).json({ courseName });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- deleteCourseController */
/**
 * Controller function to delete a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteCourseController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.body;

    try {
        const result = await deleteCourse(course_id);

        //res.status(200).json({ message: result.message });
        res.redirect('/courses/course')
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- withdrawCourseController */
/**
 * Controller function to withdraw a user from a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const withdrawCourseController = async (req, res) => {

    const { course_id } = req.body
    const username = req.cookies.username
    try {

        const courseExists = await checkIfCourseExistsById(course_id);

        if (!courseExists) {
            return res.status(400).json({ message: `Course not found with ID: ${course_id}` })
        }
        const result = await withdrawCourse(username, course_id);
        if (result !== false) {
            // return  res.status(200).json({ message: 'User withdrawn from course successfully' });
            res.redirect('/enrollments/enrollment')
        } else {
            return res.status(404).json({ message: 'User or course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- getUserCoursesController */
/**
 * Controller function to get all courses enrolled by a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the courses or error message.
 */
const getUserCoursesController = async (req, res) => {
    const username = req.cookies.username;
    try {
        const courses = await getUserCourses(username);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- searchCourseByNameController  */
/**
 * Controller function to search for courses by name.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the courses or error message.
 */
const searchCourseByNameController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { name } = req.query;
    try {
        const courses = await searchCourseByName(name);

        if (!courses || courses.length === 0) {
            res.status(404).json({ message: 'No courses found' });
        }
        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({ message: `error: ${error.message}` });
    }
};

module.exports = {
    addCourseController,
    updateCourseController,
    getCourseByIdController,
    deleteCourseController,
    withdrawCourseController,
    getUserCoursesController,
    searchCourseByNameController,
    getAllCoursesController,
    getCourseNameByIdController
}
