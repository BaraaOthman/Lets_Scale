const { query } = require("../database/db");
const bcrypt = require('bcrypt');

/**
 * Registers a new user in the database.
 * @param {string} username - The username of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} profilepic - The profile picture URL of the new user.
 * @returns {object} - The newly registered user object.
 */
const registerUser = async (username, email, password, profilepic) => {
  try {
    // SQL query to insert a new user into the database
    let registersql = `INSERT INTO users (username, email, password, profilepic) VALUES (?, ?, ?, ?)`;

    // Execute the query to register the new user
    const result = await query(registersql, [
      username,
      email,
      password,
      profilepic,
    ]);

    // Fetch the registered user from the database
    const registeredUser = await query(`SELECT * FROM users WHERE user_id = ?`, [result.insertId]);

    // Return the newly registered user object
    return registeredUser[0];
  } catch (error) {
    // Throw an error if there's an issue with the database query
    throw new Error(error);
  }
};

/**
 * Logs in a user by checking if the user exists.
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {object} - Returns an object indicating the success of the login attempt and the user object if successful.
 */
const loginUser = async (username, password) => {
  try {
    // Retrieve the user from the database based on the username
    const user = await getUserByUsername(username);

    // Check if the user exists
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Compare the stored password with the provided password
    if (user.password === password) {
      // Passwords match, user authenticated successfully

      // Retrieve the profile picture
      const profilepicResult = await query('SELECT profilepic FROM users WHERE username = ?', [username]);

      let profilepic = null;
      if (profilepicResult.length > 0) {
        profilepic = profilepicResult[0].profilepic;

      } else {
        console.log('Profile picture not found for user:', username);
      }

      // Return success, user object and profile picture
      return { success: true, user, profilepic };
    } else {
      // Incorrect password
      return { success: false, message: 'Incorrect password' };
    }
  } catch (error) {
    // Handle errors
    return { success: false, message: 'Internal server error' };
  }
};

/**
 * Retrieves a user record from the database based on the username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {object|null} - The user record if found, or null if not found.
 */
const getUserByUsername = async (username) => {
  try {
    // Construct SQL query to retrieve user by username
    const sql = `SELECT * FROM users WHERE username = ?`;

    // Execute the query with the provided username
    const result = await query(sql, [username]);
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Checks if a user exists in the database by their email address.
 * @param {string} email - The email address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsByEmail = async (email) => {
  try {
    // Query the database to count the number of users with the given email address
    const result = await query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email]);
    // Return true if count is greater than 0, indicating the user exists
    return result[0].count > 0;
  } catch (error) {
    // Return false if there's an error or if the user does not exist
    return false;
  }
};

/**
 * Checks if a user exists in the database by their id address.
 * @param {string} user_id - The Id address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsById = async (user_id) => {
  try {
    // Query the database to count the number of users with the given id address
    const result = await query("SELECT COUNT(*) AS count FROM users WHERE user_id = ?", [user_id]);
    // Return true if count is greater than 0, indicating the user exists
    return result[0].count > 0;
  } catch (error) {
    // Return false if there's an error or if the user does not exist
    return false;
  }
};

/**
 * Checks if a user exists in the database by their id address.
 * @param {string} user_id - The Id address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const getuseridfromusername = async (username) => {
  try {
    // Query the database to count the number of users with the given id address
    const result = await query("SELECT user_id FROM users WHERE username = ?", [username]);
    // Return true if count is greater than 0, indicating the user exists
    return result[0].user_id;
  } catch (error) {
    // Return false if there's an error or if the user does not exist
    return false;
  }
};

/**
 * Checks if a user exists in the database by their username.
 * @param {string} username- The username of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsByUsername = async (username) => {
  try {
    // Query the database to count the number of users with the given user ID
    const user = await query("SELECT COUNT(*) AS count FROM users WHERE username = ?", [username]);
    // Return true if count is greater than 0, indicating the user exists
    return user[0].count > 0;
  } catch (error) {
    // Return false if there's an error or if the user does not exist
    return false;
  }
};

/**
 * Retrieves the profile information of a user based on their user ID.
 * @param {number} user_id - The ID of the user whose profile information is to be retrieved.
 * @returns {object} - Returns an object containing the profile information of the user, or throws an error if the user does not exist.
 */
const getUserProfile = async (username) => {
  try {
    // Retrieve user_id for the given username
    const userQuery = 'SELECT user_id FROM users WHERE username = ?';
    const userRows = await query(userQuery, [username]);

    if (!userRows || !userRows.length) {
      throw new Error('User not found'); // Handle if user does not exist
    }

    const user_id = userRows[0].user_id;

    // Construct SQL query to retrieve user profile information
    let userProfileSql = `SELECT * FROM users WHERE user_id = ?`;

    // Execute the query with the provided user ID
    const userProfile = await query(userProfileSql, [user_id]);

    // Return the first user profile found (assuming user IDs are unique)
    return userProfile[0];

  } catch (error) {
    // Throw an error if there's any issue during the retrieval process
    throw new Error(error);
  }
};

/**
 * Updates the profile information of a user.
 * @param {number} user_id - The ID of the user whose profile is to be updated.
 * @param {object} userData - An object containing the updated user profile information.
 * @returns {boolean} - Returns true if the user profile is successfully updated, otherwise returns false.
 */
const updateUserProfile = async (user_id, userData) => {
  try {
    // Check if the user exists
    const userExists = await checkIfUserExistsById(user_id);
    if (!userExists) {
      return false;
    }

    // Extract user profile data from the userData object
    const { username, email, password, profilepic } = userData;

    // Construct SQL query to update user profile information
    const updateSql = `UPDATE users SET username = ?, email = ?, password = ?, 
    profilepic = ? WHERE user_id = ?`;

    // Execute the SQL query with the provided user ID and updated profile data
    const updatedProfile = await query(updateSql, [username, email, password, profilepic, user_id]);

    // Return true if the user profile is successfully updated
    return updatedProfile.affectedRows > 0;
  } catch (error) {
    // Throw an error if there's any issue during the update process
    throw new Error(error);
  }
};

/**
 * Updates the username for a user.
 * @param {string} newUsername - The new username.
 * @param {string} username - The current username.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateUsername = async ( newUsername,username) => {
  try {
    // Retrieve user_id for the given username
    const userQuery = 'SELECT user_id FROM users WHERE username = ?';
    const userRows = await query(userQuery, [username]);

    if (!userRows || !userRows.length) {
      throw new Error('User not found'); // Handle if user does not exist
    }

    const user_id = userRows[0].user_id;
    
    // Construct SQL query to update username
    const updateSql = 'UPDATE users SET username = ? WHERE user_id = ?';

    // Execute the SQL query with the provided user ID and new username
    const updatedUsername = await query(updateSql, [newUsername, user_id]);

    // Return true if the username is successfully updated
    return updatedUsername.affectedRows > 0;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Updates the email for a user.
 * @param {string} newEmail - The new email.
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateEmail = async ( newEmail,username) => {
  try {
    // Retrieve user_id for the given username
    const userQuery = 'SELECT user_id FROM users WHERE username = ?';
    const userRows = await query(userQuery, [username]);

    if (!userRows || !userRows.length) {
      throw new Error('User not found'); // Handle if user does not exist
    }

    const user_id = userRows[0].user_id;

    // Construct SQL query to update email
    const updateSql = 'UPDATE users SET email = ? WHERE user_id = ?';

    // Execute the SQL query with the provided user ID and new email
    const updatedEmail = await query(updateSql, [newEmail, user_id]);

    // Return true if the email is successfully updated
    return updatedEmail.affectedRows > 0;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Updates the profile picture for a user.
 * @param {string} newProfilePic - The filename of the new profile picture.
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the profile picture is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateProfilePic = async (newProfilePic, username) => {
  try {
      // Retrieve user_id for the given username
      const userQuery = 'SELECT user_id FROM users WHERE username = ?';
      const userRows = await query(userQuery, [username]);

      if (!userRows || !userRows.length) {
          throw new Error('User not found'); // Handle if user does not exist
      }

      const user_id = userRows[0].user_id;

      // Construct SQL query to update profile picture
      const updateSql = 'UPDATE users SET profilepic = ?  WHERE user_id = ?';

      // Execute the SQL query with the provided user ID and new profile picture path
      const updatedProfilePic = await query(updateSql, [newProfilePic, user_id]);

      // Return true if the profile picture is successfully updated
      return updatedProfilePic.affectedRows > 0;
  } catch (error) {
      throw new Error('Internal server error');
  }
};

/**
 * Updates the password for a user.
 * @param {string} username - The username of the user.
 * @param {string} newPassword - The new password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updatePassword = async (username, newPassword) => {
  try {
    // Retrieve user_id for the given username
    const userQuery = 'SELECT user_id FROM users WHERE username = ?';
    const userRows = await query(userQuery, [username]);

    if (!userRows || !userRows.length) {
      throw new Error('User not found'); // Handle if user does not exist
    }

    const user_id = userRows[0].user_id;

    // Construct SQL query to update email
    const updateSql = 'UPDATE users SET password = ? WHERE user_id = ?';

    // Execute the SQL query with the provided user ID and new email
    const updatedPassword = await query(updateSql, [newPassword, user_id]);

    // Return true if the email is successfully updated
    return updatedPassword.affectedRows > 0;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Deletes a user from the system by their ID.
 * @param {number} user_id - The ID of the user to be deleted.
 * @returns {object} - Returns an object with a message indicating the success of the deletion process.
 */
const deleteUserById = async (user_id) => {
  try {
    // Await the asynchronous function to check if the user exists
    const userExists = await checkIfUserExistsById(user_id);

    if (!userExists) {
      // Return a message indicating that the user was not found
      return { message: `User with ID ${user_id} not found` };
    } else {
      // Execute SQL query to delete the user from the database
      await query("DELETE FROM users WHERE user_id = ?", [user_id]);

      // Return a success message if the deletion is successful
      return { message: 'User deleted successfully' };
    }
  } catch (error) {
    // Throw an error if there's any issue during the deletion process
    throw new Error(error);
  }
};

/**
 * Retrieves the profile picture filename for a user by their username.
 * @param {string} username - The username of the user.
 * @returns {Promise<string>} - A promise that resolves to the filename of the user's profile picture.
 * @throws {Error} - If there's an issue with the database query or the user is not found.
 */
const getUserImageByUsername = async (username) => {
  try {
    const profilepicResult = await query('SELECT profilepic FROM users WHERE username = ?', [username]);
    return profilepicResult[0].profilepic;

  } catch {
    throw new Error(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUsername,
  deleteUserById,
  checkIfUserExistsByUsername,
  getUserImageByUsername,
  updateEmail,
  updatePassword,
  updateProfilePic,
  getuseridfromusername
};
