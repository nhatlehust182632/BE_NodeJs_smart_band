const util = require('util');
const userRepository = require('../repositories/user.repository');
const getLoginUser = util.promisify(userRepository.getLoginUser);

const saveRegister = (data, callback) => {
  userRepository.insertRegister(data, callback);
};

const loginUser = (data, callback) => {
  userRepository.getLoginUser(data, callback);
};

const getProfileInfo = (data, callback) => {
  userRepository.getProfileInfo(data, callback);
};

const getUserByPhone = (data, callback) => {
  userRepository.getUserByPhone(data, callback);
};

const getUserInfoEdit = (data, callback) => {
  userRepository.getUserInfoEdit(data, callback);
};

const getProfileInfoEdit = (data, callback) => {
  userRepository.postUserInfoUpdate(data, callback);
};

module.exports = {
  saveRegister,
  loginUser,
  getProfileInfo,
  getUserByPhone,
  getProfileInfoEdit,
  getUserInfoEdit
};