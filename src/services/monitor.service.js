const getMonitorRepository = require('../repositories/monitor.repository');

const getListMonitorByIdService = async (data) => {
    const listMonitor = await getMonitorRepository.getListMonitorRepository(data);
    if (!listMonitor || listMonitor.length === 0) {
        return null;
    }
    return listMonitor;
};

const getMonitorIdDetailService = async (data) => {
    const listMonitor = await getMonitorRepository.getMonitorIdRepository(data);
    if (!listMonitor || listMonitor.length === 0) {
        return null;
    }
    return listMonitor[0];
};

const getFollowingService = async (data) => {
    const rows = await getMonitorRepository.getFollowingRepository(data);
    return rows || [];
};

const getFollowersService = async (data) => {
    const rows = await getMonitorRepository.getFollowersRepository(data);
    return rows || [];
};

const getPendingForTargetService = async (data) => {
    const rows = await getMonitorRepository.getPendingForTargetRepository(data);
    return rows || [];
};

const approveRequestService = async (data) => {
    const result = await getMonitorRepository.approveRequestRepository(data);
    if (!result || result.affectedRows === 0) {
        return null;
    }
    return result;
};

const createRequestByPhoneService = async (data) => {
    const result = await getMonitorRepository.createRequestByPhoneRepository(data);
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
    createRequestByPhoneService
};
