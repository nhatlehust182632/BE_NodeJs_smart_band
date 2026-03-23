const userRepository = require('../repositories/user.repository');

const saveRegister = (data, callback) => {
  userRepository.insertRegister(data, callback);
};

const loginUser = (data, callback) => {
  userRepository.getLoginUser(data, callback);
};

const getProfileInfo = (data, callback) => {
  userRepository.getProfileInfo(data, callback);
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
  getProfileInfoEdit,
  getUserInfoEdit
};