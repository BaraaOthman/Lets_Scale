const { check } = require("express-validator");

/*-- registerUserValidator */
// Validates the request body for registering a new user.
const registerUserValidator = [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
    check('password').isStrongPassword().withMessage('Weak password'),
    
];

/*-- loginUserValidator */
// Validates the request body for user login.
const loginUserValidator = [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('password').notEmpty().withMessage('Password is required'),
];

/*-- updateUsernameValidator */
// Validates the request body for registering a new user.
const updateUsernameValidator = [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('newUsername').notEmpty().withMessage('New Username is required'),
    check('newUsername').isString().withMessage('Inavlid username'),
];

/*-- updateUsernameValidator */
// Validates the request body for registering a new user.
const updateEmailValidator = [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('email').notEmpty().withMessage('New Email is required'),
    check('email').isEmail().withMessage('Inavlid emal'),
];

/*-- updateUsernameValidator */
// Validates the request body for registering a new user.
const updatePasswordValidator = [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('password').notEmpty().withMessage('New Password is required'),
    check('password').isStrongPassword().withMessage('Inavlid password'),
];

/*-- logoutUserValidator */
// Validates the request body for user logout.
const logoutUserValidator = [
    check('user_id').notEmpty().withMessage('User ID is required'),
    check('user_id').isInt().withMessage('Invalid user ID'),
];

/*-- updateUserProfileValidator */
// Validates the request body for updating user profile.
const updateUserProfileValidator = [
    check('user_id').notEmpty().withMessage('User ID is required'),
    check('user_id').isInt().withMessage('Invalid user ID'),
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Invalid username'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
    check('password').isStrongPassword().withMessage('Weak password'),
    check('profilepic').notEmpty().withMessage('Profile picture is required'),
    check('profilepic').isString().withMessage('Invalid profile picture'),
];

module.exports = {
    registerUserValidator,
    loginUserValidator,
    logoutUserValidator,
    updateUserProfileValidator,
    updateUsernameValidator,
    updateEmailValidator,
    updatePasswordValidator
};
