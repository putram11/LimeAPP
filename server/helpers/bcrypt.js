const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const comparePassword = (password, hashedPassword) => {
  const isMatch = bcrypt.compareSync(password, hashedPassword);
  return isMatch;
};

module.exports = {
  hashPassword,
  comparePassword,
};
