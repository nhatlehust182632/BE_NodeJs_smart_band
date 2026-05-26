const atrialService = require('../services/atrial.service');

const saveAtrialAlertController = async (req, res) => {
    try {
        const { user_id, threshold_value, message } = req.body;
        if (!user_id || threshold_value == null) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }

        const result = await atrialService.saveAtrialAlertService({
            user_id,
            threshold_value,
            message
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Luu canh bao that bai'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Luu canh bao moi thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Luu canh bao moi that bai',
            error: error.message
        });
    }
};

const getAtrialAlertCountController = async (req, res) => {
    try {
        const { idUser, date } = req.query;
        if (!idUser) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }

        const result = await atrialService.countAtrialAlertsByDateService({ idUser, date });
        if (!result) {
            return res.status(200).json({
                success: true,
                message: 'Khong tim thay du lieu',
                data: { total_alerts_today: 0 }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lay so luong canh bao theo user va ngay thanh cong',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lay so luong canh bao that bai',
            error: error.message
        });
    }
};

module.exports = {
    saveAtrialAlertController,
    getAtrialAlertCountController
};
