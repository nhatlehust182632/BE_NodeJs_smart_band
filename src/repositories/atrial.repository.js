const { runSqlRepository } = require('../../src/repositories/utils.repository');

const saveAtrialAlertRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'atrial/saveAlert.insert.sql',
        data: [
            data.user_id,
            data.threshold_value,
            data.message || null
        ]
    });
};

const countAtrialAlertsByDateRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'atrial/countByUser.select.sql',
        data: [data.idUser, data.date || null]
    });
};

module.exports = {
    saveAtrialAlertRepository,
    countAtrialAlertsByDateRepository
};
