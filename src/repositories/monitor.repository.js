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

const getFollowingRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/getFollowing.select.sql',
        data: [data.idUser]
    });
};

const getFollowersRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/getFollowers.select.sql',
        data: [data.idUser]
    });
};

const getPendingForTargetRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/getPendingForTarget.select.sql',
        data: [data.idUser]
    });
};

const approveRequestRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/approveRequest.update.sql',
        data: [data.relationId, data.idUser]
    });
};

const createRequestByPhoneRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/createRequestByPhone.insert.sql',
        data: [data.idUser, data.targetUserId, data.relationship_type || 8, data.permission_level || 1]
    });
};

const cancelMonitoringRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/cancelMonitoring.update.sql',
        data: [data.relationId, data.idUser]
    });
};

const cancelFollowerRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'monitor/cancelFollower.update.sql',
        data: [data.relationId, data.idUser]
    });
};

module.exports = {
    getListMonitorRepository,
    getMonitorIdRepository,
    getFollowingRepository,
    getFollowersRepository,
    getPendingForTargetRepository,
    approveRequestRepository,
    createRequestByPhoneRepository,
    cancelMonitoringRepository,
    cancelFollowerRepository
};
