const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST /api/user/register
// - Tạo người dùng mới trong bảng `users`
// - Thông tin chính: phone, full_name, password_hash, email, status, created_at
router.post('/register', userController.creatUser);

// GET /api/user/login
// - Đăng nhập người dùng trên bảng `users`
// - Kiểm tra `id` và `password_hash`
router.get('/login', userController.loginUser);

// GET /api/user/selectInfo
// - Lấy hồ sơ người dùng từ bảng `users`
// - Trả về các trường profile như email, phone, full_name, gender, date_of_birth, height_cm, weight_kg, emergency_phone, enable_heart_rate_alert, status
router.get('/selectInfo', userController.getInfoUser);

// GET /api/user/getInfoEdit
// - Lấy dữ liệu người dùng để hiển thị form chỉnh sửa
// - Truy vấn bảng `users` và trả về thông tin hiện tại của user
router.get('/getInfoEdit', userController.getInfoUserEdit);

// POST /api/user/updateInfo
// - Cập nhật thông tin người dùng trong bảng `users`
// - Có thể sửa full_name, gender, date_of_birth, height_cm, weight_kg, emergency_phone, enable_heart_rate_alert
router.post('/updateInfo', userController.postInfoUpdate);

module.exports = router;