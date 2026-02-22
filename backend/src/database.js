const knexLib = require("knex");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const db = knexLib({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  },
  pool: { min: 0, max: 10 },
});

module.exports = db;