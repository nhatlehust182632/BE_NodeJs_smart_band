const { runSqlRepository } = require('../../src/repositories/utils.repository');

const saveDisconnectAlertRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'disconnect/saveAlert.insert.sql',
        data: [
            data.user_id,
            data.user_device_id,
            data.last_seen_at || null,
            data.message || null,
            data.status || 1
        ]
    });
};

const countDisconnectAlertsTodayByUserRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'disconnect/countTodayByUser.select.sql',
        data: [data.id]
    });
};

module.exports = {
    saveDisconnectAlertRepository,
    countDisconnectAlertsTodayByUserRepository
};
