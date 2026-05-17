const { runSqlRepository } = require('../../src/repositories/utils.repository');

const getListMonitorRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/getMonitor.select.sql',
        data: [data.id]
    });
};

const getMonitorIdRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/getMonitorId.select.sql',
        data: [data.id]
    });
};

module.exports = {
    getListMonitorRepository,
    getMonitorIdRepository
}