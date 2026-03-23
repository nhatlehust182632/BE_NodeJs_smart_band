const mysql = require('mysql2');
const env = require('./env');

const db = mysql.createConnection({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName
});

module.exports = db;