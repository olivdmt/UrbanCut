const knex = require("knex");
require('dotenv').config();

const knex = require('knex')({
    client: 'pg',
    connection:
        process.env.DATABASE_URL, //Render fornece essa env
        pool: { min: 0, max: 10},
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false} : false,
});

module.exports = knex;