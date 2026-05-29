const getLocationRepository = require('../repositories/location.repository');

const saveLocationPlaceService = async (data) => {
    const locationSave = await getLocationRepository.saveLocationPlaceRepository(data);

    if (!locationSave) {
        return null;
    }

    const locationHistory = await getLocationRepository.getLocationHistoryRepository(data);
    const locationTop = await getLocationRepository.getLocationTopRepository(data);

    return {
        historyData: Array.isArray(locationHistory) ? locationHistory : [],
        topData: Array.isArray(locationTop) ? locationTop : []
    };
};

const getHistoryLocationService = async (data) => {
    const locationHistory = await getLocationRepository.getLocationHistoryRepository(data);

    return Array.isArray(locationHistory) ? locationHistory : [];
};

const getTopLocationService = async (data) => {
    const locationTop = await getLocationRepository.getLocationTopRepository(data);

    return Array.isArray(locationTop) ? locationTop : [];
};

module.exports = {
    saveLocationPlaceService,
    getHistoryLocationService,
    getTopLocationService
};