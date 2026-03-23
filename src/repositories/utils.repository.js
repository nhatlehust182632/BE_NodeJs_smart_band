const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const runSqlRepository = ({ sqlDatabase, data = [] }) => {
  return new Promise((resolve, reject) => {
    try {
      const sqlPath = path.isAbsolute(sqlDatabase)
        ? sqlDatabase
        : path.join(__dirname, '../sql/', sqlDatabase);
      // console.log("runSqlRepository: " + sqlPath);
      const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

      db.query(sqlQuery, [...data], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  runSqlRepository,
};