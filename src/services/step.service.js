const stepRepository = require('../repositories/step.repository');

const saveStepDataService = async (data) => {
    const { user_id, steps, distance_m, calories, recorded_date } = data;

    // Sử dụng ngày hiện tại nếu không được cung cấp
    const dateToSave = recorded_date || new Date().toISOString().split('T')[0];

    // Kiểm tra xem có dữ liệu trong ngày này không
    const existingData = await stepRepository.getStepData({
        user_id,
        recorded_date: dateToSave
    });

    if (existingData && existingData.length > 0) {
        // Nếu đã có dữ liệu, chỉ cập nhật steps
        const result = await stepRepository.updateStepData({
            steps,
            user_id,
            recorded_date: dateToSave
        });

        if (!result || result.affectedRows === 0) {
            return null;
        }

        return {
            user_id,
            steps,
            recorded_date: dateToSave,
            updated: true
        };
    } else {
        // Nếu chưa có dữ liệu, lưu toàn bộ
        const result = await stepRepository.saveStepData({
            user_id,
            steps,
            distance_m,
            calories,
            recorded_date: dateToSave
        });

        if (!result || result.affectedRows === 0) {
            return null;
        }

        return {
            id: result.insertId || null,
            user_id,
            steps,
            distance_m,
            calories,
            recorded_date: dateToSave,
            created: true
        };
    }
};

const getStepDataService = async (data) => {
    const { user_id, recorded_date } = data;

    const result = await stepRepository.getStepData({
        user_id,
        recorded_date
    });

    if (!result || result.length === 0) {
        return null;
    }

    return result[0];
};

const getStepHistoryService = async (data) => {
    const { user_id, days = 7 } = data;

    const result = await stepRepository.getStepHistory({
        user_id,
        days
    });

    return result || [];
};

const updateStepDataService = async (data) => {
    const { user_id, steps, recorded_date } = data;

    const result = await stepRepository.updateStepData({
        steps,
        user_id,
        recorded_date
    });

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return {
        user_id,
        steps,
        recorded_date
    };
};

module.exports = {
    saveStepDataService,
    getStepDataService,
    getStepHistoryService,
    updateStepDataService
};
