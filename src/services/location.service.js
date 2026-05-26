const getLocationRepository = require('../repositories/location.repository');

const saveLocationPlaceService = async (data) => {
    const locationSave = await getLocationRepository.saveLocationPlaceRepository(data);
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
