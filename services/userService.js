const { appDataSource } = require('../models/data-source');
const User = appDataSource.getRepository('User');

const createUser = async (userData) => {
  const user = User.create(userData);
  await User.save(user);
  return user;
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

module.exports = {
  createUser,
  getUserByEmail,
};
