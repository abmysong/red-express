const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'lusoella@localhost',
  password: '',
  database: 'test'
});

db.query('select ? as ?', [123, 'abcd'], function(error, rows) {
  console.log(error);
  console.log(rows);
});

db.error = function (request, ressponse, error) {
  console.error('Start: SQL error');
  console.error(error.sql);
  console.error('End: SQL error');
  // error.sql = undefined;
  ressponse.status(500).send(error);
  return false;
};

module.exports = db;
