// dbConfig.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgre",
  host: "local_host",
  database: "scrapper",
  password: "Butw@l1!",
  //   port: 5432, // or the port your PostgreSQL server is running on
});

module.exports = pool;
