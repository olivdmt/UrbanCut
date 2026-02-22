// backend/src/database.js
const knexLib = require("knex");
require("dotenv").config();

const db = knexLib({
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 10 },
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = db;