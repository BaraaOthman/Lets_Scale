/**
 * Database Connection Module
 * Description:
 * This module provides functionality to establish a connection with a MySQL database
 * and execute SQL queries asynchronously using the `mysql2/promise` library.
 * 
 * Dependencies:
 * - mysql2/promise
 * - config.js
 */
const mysql = require("mysql2/promise");
const config = require("./config");

var connection;
/**
 *  Function: connect()
 * 
 * Description:
 * Establishes a connection with the MySQL database specified in the `config.js` file.
 * 
 * Usage:
 * Call this function to connect to the database.
 * 
 * Returns:
 * No explicit return value.
 * 
 * Throws:
 * Exits the process with an error message if connection fails.
 */
const connect = async () => {
    try {
        connection = await mysql.createConnection(config.db);
        console.log("==================================================");
        console.log(`>>>> Connection to ${process.env.DB_NAME} successful`);
        console.log("==================================================");
    } catch (error) {
        console.error(`>>> Error connecting to ${process.env.DB_NAME}`, error);
        process.exit();
    }
}
/**
 * Function: query(sql, params)
 * 
 * Description:
 * Executes a SQL query on the connected database.
 * 
 * Parameters:
 * - `sql`: A string containing the SQL query to execute.
 * - `params`: An array of values to be used as parameters in the SQL query (optional).
 * 
 * Usage:
 * Call this function to execute SQL queries.
 * 
 * Returns:
 * A promise that resolves with the query results.
 * 
 * Throws:
 * Propagates any query errors to the calling function. 
 */
const query = async (sql, params) => {
    if (!connection) {
        await connect();
    }
    try {
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error(`Query error -> ${sql}: ${error}`);
        // propagate the error to the parent layer
        throw new Error(error);
    }

}

module.exports = {
    query,
}