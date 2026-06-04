const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { runSqlRepository } = require('../../src/repositories/utils.repository');

const getHeartRateInfoRepository = (data) => {
  return runSqlRepository({
    sqlDatabase: 'heartRate/infoNew.select.sql',
    data: [data.id]
  });
};

const getHeartRateByTimeRepository = (data) => {
  switch (data.type) {
    case '1H':
      return runSqlRepository({
        sqlDatabase: 'heartRate/getHeartRate1H.select.sql',
        data: [data.id]
      });
    case '6H':
      return runSqlRepository({
        sqlDatabase: 'heartRate/getHeartRate6H.select.sql',
        data: [data.id]
      });
    case '24H':
      return runSqlRepository({
        sqlDatabase: 'heartRate/getHeartRate24H.select.sql',
        data: [data.id]
      });
    default:
      return null;
  }

};

const saveHeartRateDataRepository = (data) => {
  return runSqlRepository({
    sqlDatabase: 'heartRate/saveHeartRateData.insert.sql',
    data: [data.bpm, data.idUser]
  });
};

const getHeartRateHistoryRepository = (data) => {
  return runSqlRepository({
    sqlDatabase: 'heartRate/historyHeartRate.select.sql',
    data: [data.id]
  });
};
module.exports = {
  getHeartRateInfoRepository,
  getHeartRateByTimeRepository,
  getHeartRateHistoryRepository,
  saveHeartRateDataRepository
}