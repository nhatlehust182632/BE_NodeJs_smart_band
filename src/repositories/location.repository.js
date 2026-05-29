const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { runSqlRepository } = require('../../src/repositories/utils.repository');

const saveLocationPlaceRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'location/placeNow.insert.sql',
        data: [data.id, data.latitude, data.longitude, data.place_key || null, data.place_name]
    });
};

const getLocationHistoryRepository = (data) => {
    const days = Number(data.days) || 1;

    return runSqlRepository({
        sqlDatabase: 'location/history.select.sql',
        data: [data.id, days]
    });
};

const getLocationTopRepository = (data) => {
    const days = Number(data.days) || 1;

    return runSqlRepository({
        sqlDatabase: 'location/top.select.sql',
        data: [data.id, days]
    });
};

module.exports = {
    saveLocationPlaceRepository,
    getLocationHistoryRepository,
    getLocationTopRepository
}
