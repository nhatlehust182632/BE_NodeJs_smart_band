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

module.exports = {
    getListMonitorByIdService,
    getMonitorIdDetailService
};