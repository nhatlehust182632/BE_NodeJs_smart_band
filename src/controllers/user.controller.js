const userService = require('../services/user.services');
const userRepository = require('../repositories/user.repository');

// Controller quản lý người dùng, tương tác với bảng `users` trong SQL.
// Bảng `users` chứa các trường chính: id, email, phone, password_hash, full_name,
// gender, date_of_birth, height_cm, weight_kg, emergency_phone,
// enable_heart_rate_alert, status, created_at, updated_at.

const creatUser = (req, res) => {
  const { id, phone, full_name, password_hash, email } = req.body;
  if (!id || phone == null || full_name == null || password_hash == null) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu dữ liệu đăng ký',
      body: req.body
    });
  }

  // Kiểm tra xem `phone` đã tồn tại trong bảng `users` chưa
  userService.getUserByPhone(
    { phone },
    (errCheck, rowsCheck) => {
      if (errCheck) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi kiểm tra số điện thoại: ' + errCheck
        });
      }

      if (rowsCheck && rowsCheck.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng đăng ký'
        });
      }

      // Nếu chưa tồn tại, thực hiện lưu bản ghi
      userService.saveRegister(
        { id, phone, full_name, password_hash, email },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Lưu người dùng thất bại'
            });
          }

          // Sau khi lưu thành công, dùng hàm login để lấy `id` và `full_name`.
          userRepository.getLoginUser(
            { id, password_hash },
            (err2, rows) => {
              if (err2) {
                return res.status(500).json({
                  success: false,
                  message: 'Tạo người dùng thành công nhưng không thể lấy thông tin: ' + err2
                });
              }

              const user = rows && rows[0] ? rows[0] : null;
              return res.status(201).json({
                success: true,
                message: 'Đăng ký người dùng thành công',
                data: user ? { id: user.id, full_name: user.full_name } : null
              });
            }
          );
        }
      );
    }
  );
};

const loginUser = (req, res) => {
  // GET /api/user/login
  // Thực hiện xác thực trong bảng `users` với `id` và `password_hash`.
  const { id, password_hash } = req.query;
  if (!id || password_hash == null) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu id hoặc password_hash',
      body: req.query
    });
  }

  userService.loginUser(
    { id, password_hash },
    (err, result, fields) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Đăng nhập thất bại: ' + err
        });
      }

      if (!result || result.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Sai id hoặc mật khẩu'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result[0]
      });
    }
  );
};

const getInfoUser = (req, res) => {
  // GET /api/user/selectInfo
  // Lấy hồ sơ người dùng từ bảng `users`.
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu id người dùng'
    });
  }

  userService.getProfileInfo(
    { id },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Lấy hồ sơ người dùng thất bại: ' + err
        });
      }

      res.status(200).json({
        success: true,
        message: 'Lấy hồ sơ người dùng thành công',
        data: result[0]
      });
    }
  );
};

const getInfoUserEdit = (req, res) => {
  // GET /api/user/getInfoEdit
  // Lấy dữ liệu người dùng để hiển thị trong form chỉnh sửa.
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu id người dùng'
    });
  }

  userService.getUserInfoEdit(
    { id },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Lấy thông tin chỉnh sửa thất bại: ' + err
        });
      }

      res.status(200).json({
        success: true,
        message: 'Lấy thông tin người dùng để chỉnh sửa thành công',
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
      message: 'Thiếu id người dùng'
    });
  }

  userService.getProfileInfoEdit(
    { ...req.body },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Cập nhật thông tin thất bại: ' + err
        });
      }

      if (!result || result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng để cập nhật'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin người dùng thành công',
        data: {
          affectedRows: result.affectedRows,
          changedRows: result.changedRows
        }
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