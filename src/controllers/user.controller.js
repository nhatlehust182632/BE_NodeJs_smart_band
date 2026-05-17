const userService = require('../services/user.services');

const creatUser = (req, res) => {
  const { id, phone, full_name, password_hash } = req.body;
  if (!id || phone == null || full_name == null || password_hash == null) {
    return res.status(400).json({
      success: false,
      message: 'Thieu du lieu',
      body: req.body
    });
  }

  userService.saveRegister(
    { id, phone, full_name, password_hash },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Luu du lieu that bai'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Luu du lieu thanh cong',
        insertId: result.insertId
      });
    }
  );
};

const loginUser = (req, res) => {
  // const { id, password_hash } = req.params;
  const { id, password_hash, full_name } = req.query;
  if (!id || password_hash == null) {
    return res.status(400).json({
      success: false,
      message: req.params,
      body: req.body
    });
  }

  userService.loginUser(
    { id, password_hash },
    (err, result, fields) => {                // fields (ít dùng) là metadata (thông tin mô tả các cột) trong kết quả query

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Đăng nhập thất bại: ' + err
        });
      }

      if (!result || result.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Sai id hoặc mật khẩu',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result[0]
      });
    }
  );
  //getDeviceByUserId.select.sql
};

const getInfoUser = (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin dữ liệu',
    });
  }

  userService.getProfileInfo(
    { id },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Dữ liệu người dùng thất bại' + err
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hồ sơ người dùng thành công',
        data: result[0]
      });
    }
  );
};

const getInfoUserEdit = (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin dữ liệu',
    });
  }

  userService.getUserInfoEdit(
    { id },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Dữ liệu người dùng thất bại' + err
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hồ sơ người dùng thành công',
        data: result[0]
      });
    }
  );
};

const postInfoUpdate = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin dữ liệu',
    });
  }

  userService.getProfileInfoEdit(
    { ...req.body },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Dữ liệu người dùng thất bại' + err
        });
      }

      res.status(200).json({
        success: true,
        message: 'Lưu thông tin người dùng thành công',
        data: result[0]
      });
    }
  );
};

module.exports = {
  creatUser,
  loginUser,
  getInfoUser,
  getInfoUserEdit,
  postInfoUpdate
};