const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { runSqlRepository } = require('../../src/repositories/utils.repository');

const saveLocationPlaceRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'location/placeNow.insert.sql',
        data: [data.userDeviceId, data.latitude, data.longitude, data.place_key, data.place_name]
    });
};

const getLocationHistoryRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'location/history.select.sql',
        data: [data.id]
    });
};

const getLocationTopRepository = (data) => {
    return runSqlRepository({
        sqlDatabase: 'location/top.select.sql',
        data: [data.id]
    });
};

module.exports = {
    saveLocationPlaceRepository,
    getLocationHistoryRepository,
    getLocationTopRepository
}