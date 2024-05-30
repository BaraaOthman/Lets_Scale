const { checkIfCourseExistsById } = require("../services/Course.services");
const { enrollCourse, getUserEnrollments, checkIfUserEnrolled } = require("../services/Enrollment.services");

/**-- enrollCourseController */
/** 
 * Controller function to enroll a user in a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const enrollCourseController = async (req, res) => {
    const { course_id } = req.body;
    const username = req.cookies.username;

    try {
        // Check if the course exists
        const courseExists = await checkIfCourseExistsById(course_id);

        if (!courseExists) {
            return res.status(404).send(`Course not found with ID: ${course_id}`);
        }

        // Check if the user is already enrolled
        const isEnrolled = await checkIfUserEnrolled(username, course_id);
        if (isEnrolled) {
            return res.status(400).send("You're already enrolled in this course");
        }

        // Enroll the user in the course
        const enrollmentResult = await enrollCourse(course_id, username);
        if (!enrollmentResult) {
            return res.status(500).send("Failed to enroll user in the course");
        }

        // Successful enrollment
        res.send("User enrolled successfully");
    } catch (error) {
        // Handle unexpected errors
        res.status(500).send('You need to login!');
    }
};

/*-- getUserEnrollmentsController */
/**
 * Controller function to get enrollments of a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the user's enrollments or error message.
 */ 
const getUserEnrollmentsController = async (req, res) => {
    const username = req.cookies.username;
    try {
        const enrollments = await getUserEnrollments(username);
        res.render('enrollment', { success: true, enrollments });
    } catch (error) {
        res.redirect('/users/login');
    }
};

module.exports = {
    enrollCourseController,
    getUserEnrollmentsController,
}
