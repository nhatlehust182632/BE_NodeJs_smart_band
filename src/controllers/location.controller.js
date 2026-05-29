const locationService = require('../services/location.service');

const insertLocation = async (req, res) => {
    try {
        const { id, latitude, longitude, place_key, place_name, days } = req.body;
        if (!id || latitude === undefined || longitude === undefined || !place_name) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.body
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return res.status(400).json({
                success: false,
                message: 'latitude/longitude khong hop le',
                body: req.body
            });
        }

        const payload = {
            ...req.body,
            latitude: lat,
            longitude: lng,
            days: Number(days) || 1,
            place_key: place_key
        };

        const result = await locationService.saveLocationPlaceService(payload);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                error: 'User not found or save failed'
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
        const { id, days } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }

        const filterDays = Number(days) || 1;

        if (![1, 3, 7].includes(filterDays)) {
            return res.status(400).json({
                success: false,
                message: 'days khong hop le, chi chap nhan 1, 3, 7',
                body: req.query
            });
        }

        const result = await locationService.getHistoryLocationService({
            id,
            days: filterDays
        });

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
        const { id, days } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }

        const filterDays = Number(days) || 1;

        if (![1, 3, 7].includes(filterDays)) {
            return res.status(400).json({
                success: false,
                message: 'days khong hop le, chi chap nhan 1, 3, 7',
                body: req.query
            });
        }

        const result = await locationService.getTopLocationService({
            id,
            days: filterDays
        });

        return res.status(200).json({
            success: true,
            message: 'Lấy top 3 địa điểm đến nhiều nhất thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lấy top 3 địa điểm đến nhiều nhất thất bại',
            error: error.message
        });
    }
};

module.exports = {
    insertLocation,
    getHistoryLocationController,
    getTopLocationController
};
