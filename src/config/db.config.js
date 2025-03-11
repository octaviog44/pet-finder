const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mi_basededatos",
  password: process.env.DB_PASSWORD || "postgre",
  port: parseInt(process.env.DB_PORT) || 8080,
});

module.exports = pool;
