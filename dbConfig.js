// dbConfig.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scrapper",
  password: "Butw@l1!",
});

module.exports = pool;
