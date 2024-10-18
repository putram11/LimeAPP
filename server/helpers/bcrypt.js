const bcrypt = require("bcryptjs");

/**
 * Hashes a plain text password.
 * @param {string} password - The plain text password to hash.
 * @returns {string} The hashed password.
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
