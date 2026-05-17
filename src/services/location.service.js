const getLocationRepository = require('../repositories/location.repository');
const userRepository = require('../repositories/user.repository');

const saveLocationPlaceService = async (data) => {
    const userDevice = await userRepository.getUserDeviceId(data);
    if (!userDevice || userDevice.length === 0) {
        return null;
    }

    const locationSave = await getLocationRepository.saveLocationPlaceRepository({ ...data, userDeviceId: userDevice[0].id });
    if (!locationSave || locationSave.length === 0) {
        return null;
    }

    const locationHistory = await getLocationRepository.getLocationHistoryRepository(data);
    if (!locationHistory || locationHistory.length === 0) {
        return null;
    }
    const locationTop = await getLocationRepository.getLocationTopRepository(data);
    if (!locationTop || locationTop.length === 0) {
        return null;
    }
    return {
        historyData: locationHistory,
        topData: locationTop
    };
};

const getHistoryLocationService = async (data) => {
    const locationHistory = await getLocationRepository.getLocationHistoryRepository(data);
    if (!locationHistory || locationHistory.length === 0) {
        return null;
    }

    return locationHistory;
};

const getTopLocationService = async (data) => {
    const locationTop = await getLocationRepository.getLocationTopRepository(data);
    if (!locationTop || locationTop.length === 0) {
        return null;
    }
    return locationTop;
};

module.exports = {
    saveLocationPlaceService,
    getHistoryLocationService,
    getTopLocationService
};