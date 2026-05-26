const atrialRepository = require('../repositories/atrial.repository');

const saveAtrialAlertService = async (data) => {
    const result = await atrialRepository.saveAtrialAlertRepository(data);
    if (!result || result.affectedRows === 0) {
        return null;
    }
    return result;
};

const countAtrialAlertsByDateService = async (data) => {
    const result = await atrialRepository.countAtrialAlertsByDateRepository(data);
    if (!result || result.length === 0) {
        return 0;
    }
    return result[0];
};

module.exports = {
    saveAtrialAlertService,
    countAtrialAlertsByDateService
};
