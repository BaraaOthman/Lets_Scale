const express = require('express');

// Import controllers and validator
const { sendMessageController, getMessagesController } = require("../controllers/Contact.controller");
const { sendMessageValidator } = require('../validators/Contact.validators');

// Create a router instance
const router = express.Router();

// Define routes and their respective controllers and validators
router.post('/sendMessage', sendMessageValidator, sendMessageController); // Route to send a message
router.get('/messages', getMessagesController); // Route to retrieve messages

module.exports = router;
