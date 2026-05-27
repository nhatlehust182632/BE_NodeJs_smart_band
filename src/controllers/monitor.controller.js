const monitorService = require('../services/monitor.service');
const { runSqlRepository } = require('../repositories/utils.repository');

const selectMonitorList = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }
        const result = await monitorService.getListMonitorByIdService(req.query);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin giám sát thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy thông tin giám sát thất bại',
            error: error.message,
            body: req.query
        });
    }
};

const selectMonitorId = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }
        const result = await monitorService.getMonitorIdDetailService(req.query);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin người được giám sát thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy thông tin được giám giám sát thất bại',
            error: error.message,
            body: req.query
        });
    }
};

const getFollowingController = async (req, res) => {
    try {
        const { idUser } = req.query;
        if (!idUser) {
            return res.status(400).json({ success: false, message: 'Thieu du lieu', body: req.query });
        }
        const result = await monitorService.getFollowingService({ idUser });
        return res.status(200).json({
            success: true,
            message: 'Lay danh sach dang theo doi thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lay danh sach that bai', error: error.message });
    }
};

const getFollowersController = async (req, res) => {
    try {
        const { idUser } = req.query;
        if (!idUser) {
            return res.status(400).json({ success: false, message: 'Thieu du lieu', body: req.query });
        }
        const result = await monitorService.getFollowersService({ idUser });
        return res.status(200).json({
            success: true,
            message: 'Lay danh sach nguoi theo doi minh thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lay danh sach that bai', error: error.message });
    }
};

const getPendingRequestsController = async (req, res) => {
    try {
        const { idUser } = req.query;
        if (!idUser) {
            return res.status(400).json({ success: false, message: 'Thieu du lieu', body: req.query });
        }
        const result = await monitorService.getPendingForTargetService({ idUser });
        return res.status(200).json({
            success: true,
            message: 'Lay danh sach cho xac nhan thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lay danh sach that bai', error: error.message });
    }
};

const approveRequestController = async (req, res) => {
    try {
        const { idUser, relationId } = req.body;
        if (!idUser || !relationId) {
            return res.status(400).json({ success: false, message: 'Thieu du lieu', body: req.body });
        }
        const result = await monitorService.approveRequestService({ idUser, relationId });
        if (!result) {
            return res.status(404).json({ success: false, message: 'Khong tim thay yeu cau hop le de xac nhan' });
        }
        return res.status(200).json({
            success: true,
            message: 'Xac nhan theo doi thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Xac nhan theo doi that bai', error: error.message });
    }
};

const sendFollowRequestByPhoneController = async (req, res) => {
    try {
        const { idUser, phone, relationship_type, permission_level } = req.body;
        if (!idUser || !phone) {
            return res.status(400).json({ success: false, message: 'Thieu du lieu', body: req.body });
        }

        const userByPhone = await runSqlRepository({
            sqlDatabase: 'users/phone.select.sql',
            data: [phone]
        });
        if (!userByPhone || userByPhone.length === 0) {
            return res.status(404).json({ success: false, message: 'Khong tim thay nguoi dung theo so dien thoai' });
        }

        const targetUserId = userByPhone[0].id;
        if (Number(targetUserId) === Number(idUser)) {
            return res.status(400).json({ success: false, message: 'Khong the gui yeu cau theo doi chinh minh' });
        }

        const result = await monitorService.createRequestByPhoneService({
            idUser,
            targetUserId,
            relationship_type,
            permission_level
        });
        if (!result) {
            return res.status(500).json({ success: false, message: 'Gui yeu cau theo doi that bai' });
        }

        return res.status(200).json({
            success: true,
            message: 'Gui yeu cau theo doi thanh cong',
            data: {
                target_user_id: targetUserId,
                affectedRows: result.affectedRows
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gui yeu cau theo doi that bai', error: error.message });
    }
};


module.exports = {
    selectMonitorList,
    selectMonitorId,
    getFollowingController,
    getFollowersController,
    getPendingRequestsController,
    approveRequestController,
    sendFollowRequestByPhoneController
};
