const { query } = require("../database/db");

/**
 * Sends a message submitted through a contact form.
 * @param {string} email - The email address of the sender.
 * @param {string} subject - The subject of the message.
 * @param {string} message - The content of the message.
 * @param {string} username - The username of the user sending the message.
 * @returns {object} - Result of the database operation.
 */
const sendMessage = async (email,subject,message,username) => {
    
    try {
        // SQL query to insert the message into the contact table
        let messageSql = 'INSERT INTO contact (email, subject, message, username) VALUES (?, ?, ?, ?)';

        const values = [email, subject, message,username];

        // Execute the SQL query
        const messageResult = await query(messageSql, values);

        // Return the result of the database operation
        return messageResult;
    } catch (error) {
        // Throw an error if there's an issue with the database query or if the user does not exist
        throw new Error(error);
    }
};

/**
 * Retrieves all messages submitted through the contact form.
 * @returns {Array} - An array containing all messages.
 */
const getMessages = async () => {
    try {
        // SQL query to retrieve all messages from the contact table
        const messagesSql = `SELECT * FROM contact`;

        // Execute the SQL query
        const messages = await query(messagesSql);

        // Return the array containing all messages
        return messages;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

module.exports = {
    sendMessage,
    getMessages,
}
