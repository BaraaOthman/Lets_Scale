const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import controllers
const {
    registerUserController,
    loginUserController,
    getUserProfileController,
    deleteUserByIdController,
    logoutUserController, 
    updateUsernameController,
    updateEmailController,
    updatePasswordController,
    uploadProfilePicController
} = require('../controllers/User.controller');

// Import validators
const {
    registerUserValidator,
    loginUserValidator,
    logoutUserValidator,
} = require('../validators/Users.validators');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Profiles_Pic') // Uploads will be stored in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // File will be named with current timestamp + original filename
    }
});

// Initialize multer
const upload = multer({ storage });

// Define routes and their respective controllers
router.post('/register', upload.single('profilepic'), registerUserValidator, registerUserController); // Route to register a user
router.post('/login', loginUserValidator, loginUserController); // Route to login a user
router.get('/logout', logoutUserController); // Route to logout a user
router.get('/userProfile', getUserProfileController); // Route to get user profile by ID
router.delete('/:user_id', logoutUserValidator, deleteUserByIdController); // Route to delete user by ID
router.post('/username', updateUsernameController);// Route to update username
router.post('/email', updateEmailController); // Route to update email
router.post('/upload-profile-pic',upload.single('newProfilePic'),uploadProfilePicController); // Route to update profile picture
router.post('/password', updatePasswordController); // Route to update password

module.exports = router;
