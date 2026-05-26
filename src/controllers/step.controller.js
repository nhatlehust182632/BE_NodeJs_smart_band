const stepService = require('../services/step.service');

const saveStepData = async (req, res) => {
    try {
        const { user_id, steps, distance_m, calories, recorded_date } = req.body;

        // Validation
        if (!user_id || steps == null) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id hoặc steps'
            });
        }

        const result = await stepService.saveStepDataService({
            user_id,
            steps,
            distance_m,
            calories,
            recorded_date
        });

        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Lưu dữ liệu bước chân thất bại'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lưu dữ liệu bước chân thành công',
            data: result
        });
    } catch (error) {
        console.error('Error in saveStepData:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};

const getStepData = async (req, res) => {
    try {
        const { user_id, recorded_date } = req.query;

        if (!user_id || !recorded_date) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id hoặc recorded_date'
            });
        }

        const result = await stepService.getStepDataService({
            user_id,
            recorded_date
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getStepData:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};

const getStepHistory = async (req, res) => {
    try {
        const { user_id, days = 7 } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const result = await stepService.getStepHistoryService({
            user_id,
            days: parseInt(days)
        });

        return res.status(200).json({
            success: true,
            data: result || []
        });
    } catch (error) {
        console.error('Error in getStepHistory:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};

const updateStepData = async (req, res) => {
    try {
        const { user_id, steps, recorded_date } = req.body;

        if (!user_id || steps == null || !recorded_date) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id, steps hoặc recorded_date'
            });
        }

        const result = await stepService.updateStepDataService({
            user_id,
            steps,
            recorded_date
        });

        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Cập nhật dữ liệu bước chân thất bại'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật dữ liệu bước chân thành công',
            data: result
        });
    } catch (error) {
        console.error('Error in updateStepData:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};

module.exports = {
    saveStepData,
    getStepData,
    getStepHistory,
    updateStepData
};
