const disconnectRepository = require('../repositories/disconnect.repository');

const saveDisconnectAlertService = async (data) => {
    const result = await disconnectRepository.saveDisconnectAlertRepository(data);
    if (!result || result.affectedRows === 0) {
        return null;
    }
    return result;
};

const countDisconnectAlertsTodayByUserService = async (data) => {
    const result = await disconnectRepository.countDisconnectAlertsTodayByUserRepository(data);
    if (!result || result.length === 0) {
        return null;
    }
    return result[0];
};

module.exports = {
    saveDisconnectAlertService,
    countDisconnectAlertsTodayByUserService
};
