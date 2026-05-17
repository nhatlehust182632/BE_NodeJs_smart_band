const locationService = require('../services/location.service');

const insertLocation = async (req, res) => {
    try {
        const { id, latitude, longitude, place_key, place_name } = req.body;
        if (!id || !latitude || !longitude || !place_key || !place_name) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }
        const result = await locationService.saveLocationPlaceService(req.body);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lưu vị trí hiện tại thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lưu vị trí hiện tại thất bại',
            error: error.message
        });
    }
};

const getHistoryLocationController = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }
        const result = await locationService.getHistoryLocationService({ id });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                error: error.message
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Lấy lịch sử thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy lịch sử thất bại',
            error: error.message
        });
    }
};

const getTopLocationController = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }
        const result = await locationService.getHistoryLocationService({ id });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy top 3 địa điểm đến nhiền nhất thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy top 3 địa điểm đến nhiền nhấtthất bại',
            error: error.message
        });
    }
};

module.exports = {
    insertLocation,
    getHistoryLocationController,
    getTopLocationController
};