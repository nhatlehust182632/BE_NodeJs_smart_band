const disconnectService = require('../services/disconnect.service');

const saveDisconnectAlertController = async (req, res) => {
    try {
        const { user_id, user_device_id, last_seen_at, message, status } = req.body;
        if (!user_id || !user_device_id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }

        const result = await disconnectService.saveDisconnectAlertService({
            user_id,
            user_device_id,
            last_seen_at,
            message,
            status
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Luu canh bao disconnect that bai'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Luu canh bao disconnect thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Luu canh bao disconnect that bai',
            error: error.message
        });
    }
};

const getDisconnectAlertCountTodayController = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }

        const result = await disconnectService.countDisconnectAlertsTodayByUserService({ id });
        if (!result) {
            return res.status(200).json({
                success: true,
                message: 'Khong tim thay du lieu',
                data: { countResp: 0 }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lay so luong canh bao trong ngay thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lay so luong canh bao trong ngay that bai',
            error: error.message
        });
    }
};

module.exports = {
    saveDisconnectAlertController,
    getDisconnectAlertCountTodayController
};
