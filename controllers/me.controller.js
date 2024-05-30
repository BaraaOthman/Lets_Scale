const { getMyCourses} = require("../services/me.services");

/*-- getMyCoursesController */
/**
 * Controller function to get the courses of a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the user's courses or error message.
 */ 
const getMyCoursesController = async (req, res) => {
    const username = req.cookies.username;
    try {
        const mycourses = await getMyCourses(username);
        res.render('me', { success: true, mycourses });
    } catch (error) {
        res.redirect('/users/login');
    }
};

module.exports = {
    getMyCoursesController,
}
