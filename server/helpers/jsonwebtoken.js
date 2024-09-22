const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT;

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw error;
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
