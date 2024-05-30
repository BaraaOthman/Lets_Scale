const { validationResult } = require('express-validator');
const { registerUser, loginUser, getUserProfile, deleteUserById, checkIfUserExistsByUsername,
    updatePassword, updateUsername, updateEmail, updateProfilePic } = require('../services/User.services');

/*-- registerUserController */
/**
 * Controller function to register a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const registerUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const profilepic = req.file ? req.file.filename : null;

    try {
        const userExists = await checkIfUserExistsByUsername(username);

        if (userExists) {
            return res.json({ success: false, message: "Username already exists" });
        }

        const result = await registerUser(username, email, password, profilepic);
        if (!result) {
            return res.status(401).json({ success: false, message: "Unable to register user" });
        }

        return res.json({ success: true, message: "Welcome to LetsScale", redirectUrl: "/users/login" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/* loginUserController */
/**
 * Controller function to authenticate a user and log them in.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const loginUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { username, password } = req.body;

    try {
        // Call the loginUser function to authenticate the user
        const loginResult = await loginUser(username, password);

        // Check if login was successful
        if (loginResult.success) {
            res.cookie('username', username);

            const profilepic = loginResult.profilepic;
            if (profilepic) {
                res.cookie('profilepic', profilepic);
            } else {
                console.log('Profile picture not found for user:', username);
            }

          // Send JSON response with a success message and redirect URL
        return res.json({ success: true, message: "Welcome to LetsScale", redirectUrl: "/courses/course" });
        } else {
            res.status(401).json( loginResult.message );
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- logoutUserController */
/**
 * Controller function to log out a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const logoutUserController = async (req, res) => {
    try {
        // Clear cookies for username and profilepic
        res.clearCookie('username');
        res.clearCookie('profilepic');

        // Redirect the user to the login page
        res.redirect('/users/login');
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/*-- getUserProfileController */
/**
 * Controller function to retrieve a user's profile.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the user profile or error message.
 */
const getUserProfileController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const username = req.cookies.username;

    try {
        const userProfile = await getUserProfile(username);
        if (!userProfile || userProfile.length === 0) {
            return res.status(200).json({ message: "No user profile exists" });
        }
        //res.status(200).json({ userProfile });
        res.render('profile', { userProfile: userProfile })
    } catch (error) {
        //res.status(500).json({ message: 'You need to login!' });
        res.render('login');
    }
};

/*-- updateUsernameController */
/**
 * Controller function to update a user's username.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating the status of the username update or an error message.
 */
const updateUsernameController = async (req, res) => {
    const { newUsername } = req.body;
    const username = req.cookies.username;
    try {
        if (!newUsername) {
            return res.status(400).json({ message: "New username is required" });
        }

        // Check if the user exists
        const userExists = await checkIfUserExistsByUsername(username);
        if (!userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Update the username cookie
        res.cookie('username', newUsername);

        const result = await updateUsername(newUsername, username);

        if (!result) {
            return res.status(401).json({ message: "Username cannot be updated" });
        }

        const userProfile = await getUserProfile(newUsername);
        res.render('profile', { userProfile: userProfile })
        //res.status(200).json({ message: "Username updated successfully" });
    } catch (error) {
        console.error('Internal server error:', error); // Debugging: Log the error
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- updateEmailController */
/**
 * Controller function to update a user's email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating the status of the email update or an error message.
 */
const updateEmailController = async (req, res) => {
    const { newEmail } = req.body;
    const username = req.cookies.username;

    try {
        if (!newEmail) {
            return res.status(400).json({ message: "New email is required" });
        }

        const result = await updateEmail(newEmail, username);

        if (!result) {
            return res.status(401).json({ message: "Email cannot be updated" });
        }

        const userProfile = await getUserProfile(username);

        res.render('profile', { userProfile: userProfile })
        //res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- uploadProfilePicController */
/**
 * Controller function to upload a new profile picture for a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const uploadProfilePicController = async (req, res) => {
    try {
        const username = req.cookies.username;
        const newProfilePic = req.file.filename;
        const success = await updateProfilePic(newProfilePic, username);

        if (success) {
            // Update the cookie with the new profile picture filename
            res.cookie('profilepic', newProfilePic);

            //res.status(200).json({ success: true, message: 'Profile picture updated successfully.', profilepic: newProfilePic });
            const userProfile = await getUserProfile(username);

            res.render('profile', { userProfile: userProfile })
            //res.redirect('profile',{userProfile: userProfile})
        } else {
            return res.status(400).json({ success: false, message: 'Failed to update profile picture.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

/*-- updatePasswordController */
/**
 * Controller function to update a user's password.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updatePasswordController = async (req, res) => {
    const username = req.cookies.username;
    const { newPassword } = req.body;

    try {
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const result = await updatePassword(username, newPassword);

        if (!result) {
            return res.status(401).json({ message: "Password cannot be updated" });
        }

        //res.status(200).json({ message: "Password updated successfully" });
        const userProfile = await getUserProfile(username);

        res.render('profile', { userProfile: userProfile })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- deleteUserByIdController */
/**
 * Controller function to delete a user by their ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteUserByIdController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { user_id } = req.params;
    try {
        const deleteResult = await deleteUserById(user_id);

        res.status(200).json({ message: deleteResult.message });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserProfileController,
    updateUsernameController,
    updatePasswordController,
    uploadProfilePicController,
    updateEmailController,
    deleteUserByIdController
};
