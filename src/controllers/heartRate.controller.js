const heartRateService = require('../services/heartRate.service');

const getInfoHeartRateByUser = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }
        const result = await heartRateService.getHeartRateInfoService({ id });
        if (!result) {
            return res.status(200).json({
                success: true,
                message: 'Không tìm thấy dữ liệu',
                data: { model_name: 'Chưa có thiết bị', max_bpm: '0', min_bpm: '0', avg_bpm: '0', latest_bpm: '0' }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy dữ liệu thất bại',
            error: error.message
        });
    }
};

const getInfoHeartRateByTimes = async (req, res) => {
    try {
        const { id, type } = req.query;
        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }
        const result = await heartRateService.getHeartRateByTimeService({ id, type });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                data: [{ bpm: '0', time_hhmm: '00.00' }]
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy dữ liệu thất bại',
            error: error.message
        });
    }
};

const getInfoHeartRateHistory = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }
        const result = await heartRateService.getHeartRateHistoryService({ id });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy dữ liệu thất bại',
            error: error.message
        });
    }
};

const saveHeartRateDataByDevices = async (req, res) => {
    try {
        const { idUser, idDevices, bpm } = req.body;
        if (!idUser || !idDevices || !bpm) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu dữ liệu',
                body: req.body
            });
        }
        const result = await heartRateService.saveHeartRateDataService({ idUser, idDevices, bpm });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy dữ liệu thất bại',
            error: error.message
        });
    }
};

module.exports = {
    getInfoHeartRateByUser,
    getInfoHeartRateByTimes,
    getInfoHeartRateHistory,
    saveHeartRateDataByDevices
};