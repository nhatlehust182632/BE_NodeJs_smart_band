const getHeartRateInfo = require('../repositories/heartRate.repository');

const getHeartRateInfoService = async (data) => {
  const resultHeartRateNow = await getHeartRateInfo.getHeartRateInfoRepository(data);
  if (!resultHeartRateNow || resultHeartRateNow.length === 0) {
    return null;
  }
  return resultHeartRateNow[0];
};

const getHeartRateByTimeService = async (data) => {
  const resultHeartRateByTimes = await getHeartRateInfo.getHeartRateByTimeRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const getHeartRateHistoryService = async (data) => {
  const resultHeartRateByTimes = await getHeartRateInfo.getHeartRateHistoryRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const saveHeartRateDataService = async (data) => {
  const resultHeartRateByTimes = await getHeartRateInfo.getHeartRateHistoryRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

module.exports = {
  getHeartRateInfoService,
  getHeartRateByTimeService,
  getHeartRateHistoryService,
  saveHeartRateDataService
};