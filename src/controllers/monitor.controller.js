const monitorService = require('../services/monitor.service');

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


module.exports = {
    selectMonitorList,
    selectMonitorId
};