const Pool = require("pg").Pool;

const pool = new Pool({
  user: "ivan",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "postgres"
});

module.exports = pool;