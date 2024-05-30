const { check } = require('express-validator');

/*-- sendMessageValidator */
// Validates the request body for sending a message to a user.
const sendMessageValidator = [
    check(`email`).notEmpty().withMessage(`Email is required`),
    check(`email`).isEmail().withMessage(`Email is invalid`),
    check(`subject`).notEmpty().withMessage(`Subject is required`),
    check(`subject`).isString().withMessage(`Subject is invalid`),
    check(`message`).notEmpty().withMessage(`Message is required`),
    check(`message`).isString().withMessage(`Message is invalid`),
    check(`username`).notEmpty().withMessage(`Username is required`),
    check(`username`).isString().withMessage(`Username is invalid`),
];


module.exports = {
    sendMessageValidator,
}

