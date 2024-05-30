const { validationResult } = require('express-validator');
const { sendMessage, getMessages } = require("../services/Contact.services");
const { checkIfUserExistsByUsername } = require("../services/User.services")
const nodemailer = require("nodemailer");

/*-- sendMessageController */
/**
 * Controller function to send a message via email and notify the recipient.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const sendMessageController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, subject, message, username } = req.body;

    try {
        // Check if the user exists
        const userExists = await checkIfUserExistsByUsername(username);
        if (!userExists) {
            return res.status(400).json({ success: false, message: 'User with the provided username does not exist' });
        }

        await sendMessage(email, subject, message, username);

        // Setting up the nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email options for user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for contacting us!",
            text: `Thank you for your message. We appreciate it and value your communication. Your words 
            mean a lot to us. If there's anything specific you'd like to discuss further, please let us know. Thanks again
            for reaching out!`,
        };

        // Email options for notification
        const notificationOptions = {
            from: process.env.EMAIL_USER,
            to: "baraaothman712@gmail.com",
            subject: "Someone is contacting",
            text: `Dear Baraa, a client has contacted you with Email: ${email}.`,
        };

        // Sending email to the user
        await transporter.sendMail(userMailOptions);
        // Sending notification email
        await transporter.sendMail(notificationOptions);

          // Successful enrollment
        res.send("Your message has been sent successfully!");
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**-- getMessagesController */
/**
 * Controller function to retrieve all messages.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing messages or message indicating no messages found.
 */
const getMessagesController = async (req, res) => {
    try {
        const messages = await getMessages();

        if (!messages || messages.length === 0) {
            return res.status(401).json({ message: `No messages` });
        }


        res.status(200).json({ messages, message: 'Success' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    sendMessageController,
    getMessagesController,
}
