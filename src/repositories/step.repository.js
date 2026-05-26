const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// SQL queries
const sqlSaveStepData = fs.readFileSync(
    path.join(__dirname, '../sql/steps/saveStepData.insert.sql'),
    'utf8'
);

const sqlGetStepData = fs.readFileSync(
    path.join(__dirname, '../sql/steps/getStepData.select.sql'),
    'utf8'
);

const sqlGetStepHistory = fs.readFileSync(
    path.join(__dirname, '../sql/steps/getStepHistory.select.sql'),
    'utf8'
);

const sqlUpdateStepData = fs.readFileSync(
    path.join(__dirname, '../sql/steps/updateStepData.update.sql'),
    'utf8'
);

// Save step data (INSERT or UPDATE)
const saveStepData = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            sqlSaveStepData,
            [data.user_id, data.steps, data.distance_m, data.calories, data.recorded_date],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
};

// Get step data for specific date
const getStepData = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            sqlGetStepData,
            [data.user_id, data.recorded_date],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
};

// Get step history for last N days
const getStepHistory = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            sqlGetStepHistory,
            [data.user_id, data.days],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
};

// Update step data (only steps field)
const updateStepData = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            sqlUpdateStepData,
            [data.steps, data.user_id, data.recorded_date],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
};

module.exports = {
    saveStepData,
    getStepData,
    getStepHistory,
    updateStepData
};
