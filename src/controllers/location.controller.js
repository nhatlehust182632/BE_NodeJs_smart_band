const locationService = require('../services/location.service');

const generatePlaceKey = (latitude, longitude, gridSizeMeters = 100) => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const latRad = (lat * Math.PI) / 180;

    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = 111320 * Math.cos(latRad);

    const latGrid = Math.round((lat * metersPerDegreeLat) / gridSizeMeters);
    const lngGrid = Math.round((lng * metersPerDegreeLng) / gridSizeMeters);

    return `${latGrid}_${lngGrid}`;
};

const insertLocation = async (req, res) => {
    try {
        const { id, latitude, longitude, place_name } = req.body;
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
            place_key: generatePlaceKey(lat, lng)
        };

        const result = await locationService.saveLocationPlaceService(payload);
        // console.log('Result from saveLocationPlaceService:', result);
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
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Thieu du lieu',
                body: req.query
            });
        }
        const result = await locationService.getHistoryLocationService({ id });
        // console.log('Result from getHistoryLocationService:', result);
        // if (!result) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Không tìm thấy dữ liệu',
        //         data: []
        //     });
        // }
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
        const result = await locationService.getTopLocationService({ id });
        // console.log('Result from getTopLocationService:', result);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                error: 'No top locations found'
            });
        }

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
