const devData = require('./data/development-data/index.js');
const queryTheDatabase = require('./queries.js');
const db = require('./connection.js');

const runQueryTheDatabase = () => {
  return queryTheDatabase(devData).then(() => db.end());
};

runQueryTheDatabase();
