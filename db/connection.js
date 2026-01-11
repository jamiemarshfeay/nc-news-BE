const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`});

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
const db = new Pool(config);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("No PGDATABASE or DATABASE_URL configured");
} else if (process.env.PGDATABASE) { 
    console.log(`Connected to ${process.env.PGDATABASE}`);
} else {
    console.log("Connected to production database");
}

module.exports = db;