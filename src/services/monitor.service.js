const monitorRepository = require('../repositories/monitor.repository');

const getListMonitorByIdService = async (data) => {
    const rows = await monitorRepository.getListMonitorRepository(data);
    return rows || [];
};

const getMonitorIdDetailService = async (data) => {
    const rows = await monitorRepository.getMonitorIdRepository(data);

    if (!rows || rows.length === 0) {
        return null;
    }

    return rows[0];
};

const getFollowingService = async (data) => {
    const rows = await monitorRepository.getFollowingRepository(data);
    return rows || [];
};

const getFollowersService = async (data) => {
    const rows = await monitorRepository.getFollowersRepository(data);
    return rows || [];
};

const getPendingForTargetService = async (data) => {
    const rows = await monitorRepository.getPendingForTargetRepository(data);
    return rows || [];
};

const approveRequestService = async (data) => {
    const result = await monitorRepository.approveRequestRepository(data);

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return result;
};

const rejectRequestService = async (data) => {
    const result = await monitorRepository.rejectRequestRepository(data);

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return result;
};

const createRequestByPhoneService = async (data) => {
    const result = await monitorRepository.createRequestByPhoneRepository(data);

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return result;
};

const cancelMonitoringService = async (data) => {
    const result = await monitorRepository.cancelMonitoringRepository(data);

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return result;
};

const cancelFollowerService = async (data) => {
    const result = await monitorRepository.cancelFollowerRepository(data);

    if (!result || result.affectedRows === 0) {
        return null;
    }

    return result;
};

module.exports = {
    getListMonitorByIdService,
    getMonitorIdDetailService,
    getFollowingService,
    getFollowersService,
    getPendingForTargetService,
    approveRequestService,
    rejectRequestService,
    createRequestByPhoneService,
    cancelMonitoringService,
    cancelFollowerService
};