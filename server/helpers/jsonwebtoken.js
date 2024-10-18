const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT;

/**
 * Generates a JWT token with the provided payload.
 * @param {Object} payload - The payload to include in the token.
 * @returns {string} The generated JWT token.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey);
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} The decoded payload if the token is valid.
 * @throws Will throw an error if the token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

/**
 * Decodes a JWT token without verifying its validity.
 * @param {string} token - The JWT token to decode.
 * @returns {Object} The decoded payload.
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
