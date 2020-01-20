const mysql = require('mysql');
const util = require('util');

const dbconfig = require('./db.json');

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  debug: false,
  timezone: 'UTC+0',
  multipleStatements: true
});

const query = async (sql) => {
  try {
    const promise = new Promise((resolve, reject) => {
      pool.query(sql, (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
    const rows = await promise;
    return rows;
  } catch (err) {
    console.log(`Database error while handling ${sql}`);
    throw err;
  }
};

module.exports = { query };
